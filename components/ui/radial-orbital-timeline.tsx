/* eslint-disable */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

const RadialOrbitalTimeline: React.FC<RadialOrbitalTimelineProps> = ({ timelineData }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<number[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(timelineData.find(item => item.status === 'in-progress')?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalNodes = timelineData.length;
  const radius = 200;

  useEffect(() => {
    let rotationInterval: NodeJS.Timeout;
    if (autoRotate) {
      rotationInterval = setInterval(() => {
        setRotationAngle(prev => (prev + 0.3) % 360);
      }, 50);
    }
    return () => clearInterval(rotationInterval);
  }, [autoRotate]);

  const calculateNodePosition = (index: number) => {
    const angle = (360 / totalNodes) * index + rotationAngle;
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    const zIndex = Math.round(10 + y); // Simplified z-index based on y
    const opacity = 0.7 + (y / radius) * 0.3;
    return { x, y, zIndex, opacity };
  };

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex(item => item.id === nodeId);
    if (nodeIndex === -1) return;
    const targetAngle = (360 / totalNodes) * nodeIndex;
    const currentRotation = (rotationAngle % 360 + 360) % 360;
    const desiredRotation = 270; // Position at the top
    let rotationDifference = desiredRotation - targetAngle - currentRotation;

    // Normalize the rotation to take the shortest path
    if (rotationDifference > 180) rotationDifference -= 360;
    if (rotationDifference < -180) rotationDifference += 360;

    setRotationAngle(rotationAngle + rotationDifference);
  };

  const toggleItem = (id: number) => {
    setAutoRotate(false);
    setActiveNodeId(id);
    setExpandedItems(prev => (prev.includes(id) ? [] : [id]));
    
    const related = timelineData.find(item => item.id === id)?.relatedIds || [];
    setPulseEffect([id, ...related]);
    setTimeout(() => setPulseEffect([]), 1500);

    centerViewOnNode(id);
  };
  

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center bg-transparent">
      {/* Center orb */}
      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#FF3B1F] via-orange-500 to-red-800 flex items-center justify-center animate-pulse z-20">
         <div className="absolute h-full w-full rounded-full bg-inherit animate-ping opacity-75"></div>
         <div className="absolute h-full w-full rounded-full bg-inherit animate-ping delay-500"></div>
      </div>

      {/* Orbit ring */}
      <div className="absolute w-96 h-96 border border-white/5 rounded-full z-0"></div>

      {/* Nodes */}
      {timelineData.map((item, index) => {
        const { x, y, zIndex, opacity } = calculateNodePosition(index);
        const isExpanded = expandedItems.includes(item.id);
        const isRelated = activeNodeId !== null && timelineData.find(i => i.id === activeNodeId)?.relatedIds.includes(item.id);
        const isPulsing = pulseEffect.includes(item.id);

        return (
          <motion.div
            key={item.id}
            className="absolute flex flex-col items-center cursor-pointer"
            initial={{ x: 0, y: -radius, zIndex: 10, opacity: 1 }}
            animate={{ x, y, zIndex, opacity }}
            transition={{ duration: 0.8, ease: 'circOut' }}
            style={{ zIndex }}
            onClick={() => toggleItem(item.id)}
          >
            {/* Radial glow */}
            <div className={cn(
              'absolute w-20 h-20 rounded-full transition-all duration-500',
              {
                'bg-red-500/30 blur-2xl': isExpanded,
                'bg-red-500/20 blur-xl': isRelated,
                'bg-transparent': !isExpanded && !isRelated
              }
            )} />

            {/* Icon circle */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative border border-white/10",
              {
                "bg-brand scale-110 shadow-[0_0_20px_theme(colors.brand)]": isExpanded,
                "bg-brand/80": isRelated,
                "bg-black": !isExpanded && !isRelated,
                "animate-pulse": isPulsing
              }
            )}>
              <item.icon className="w-5 h-5 text-white" />
            </div>

            {/* Title label */}
            <span className="mt-3 text-xs text-center text-white/70 w-24 whitespace-nowrap">{item.title}</span>

            {/* Expanded Card */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 40 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute top-full mt-4 w-80 z-50"
                  onClick={(e) => e.stopPropagation() } // Prevent card click from closing
                >
                  <Card className="bg-card/90 backdrop-blur-sm border-border shadow-2xl shadow-brand/10">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="font-display text-xl">{item.title}</CardTitle>
                        <Badge variant={item.status === 'completed' ? 'default' : item.status === 'in-progress' ? 'secondary': 'outline'}>{item.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{item.content}</p>
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-brand h-2.5 rounded-full"
                          style={{ width: `${item.energy}%` }}
                        ></div>
                      </div>
                       <p className="text-xs text-muted-foreground mt-1.5">Signal Energy: {item.energy}%</p>
                       {item.relatedIds.length > 0 && (
                         <div className="mt-4 pt-4 border-t border-border">
                           <h4 className="text-sm font-bold mb-2">Related Nodes</h4>
                           <div className="flex gap-2 flex-wrap">
                             {timelineData.filter(n => item.relatedIds.includes(n.id)).map(relatedNode => (
                               <button 
                                key={relatedNode.id} 
                                onClick={() => toggleItem(relatedNode.id)} 
                                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors"
                                >
                                  {relatedNode.title}
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RadialOrbitalTimeline;
