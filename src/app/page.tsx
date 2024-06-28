"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from 'embla-carousel-autoplay'

const Home = () => {
  
  return (
    <div className="flex flex-col  justify-center min-h-screen  border border-gray-400">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center items-center gap-4">
        <div className="text-4xl font-bold">
          Dive into the World of Anonymous Feedback
        </div>
        <div className="text-lg">
          True feedback where your identify remains a secret
        </div>
        {/* crousel  */}
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xs">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
