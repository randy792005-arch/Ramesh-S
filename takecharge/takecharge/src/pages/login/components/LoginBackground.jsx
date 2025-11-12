import React from 'react';

const LoginBackground = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={(e) => {
          console.error('Video failed to load. Make sure the file exists at /assets/videos/login-background.mp4');
          e.target.style.display = 'none';
        }}
      >
        <source src="/assets/videos/login-background.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback gradient background if video fails to load */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 z-0"></div>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]"></div>

      {/* Subtle background shapes for visual depth (optional, can be removed if video is enough) */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary/6 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -right-24 top-1/4 w-80 h-80 bg-secondary/6 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Login card on right side */}
      <div className="relative z-10 flex items-center justify-end min-h-screen p-6 pr-8 md:pr-12 lg:pr-16">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-elevation-3 p-8 animate-slide-up">
            {children}
          </div>

          <div className="text-center mt-6 space-y-2 animate-fade-in-up">
            <p className="text-xs text-muted-foreground">Secure authentication powered by Firebase</p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <span>© {new Date()?.getFullYear()} TakeCharge</span>
              <span>•</span>
              <button className="hover:text-foreground transition-colors duration-200">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors duration-200">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBackground;