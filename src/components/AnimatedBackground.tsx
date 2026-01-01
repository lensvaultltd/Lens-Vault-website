import React, { useEffect, useRef, useState } from 'react';

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let orbs: Orb[] = [];
        let mouse = { x: -1000, y: -1000 };

        // Configuration - Adjusted for performance on mobile
        const particleCount = isMobile ? 30 : 50;
        const orbCount = isMobile ? 2 : 4;
        const connectionDistance = isMobile ? 100 : 150;
        const mouseDistance = isMobile ? 150 : 250;

        // Floating Orbs for ambient glow
        class Orb {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            color: { r: number; g: number; b: number };
            opacity: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 150 + 100;

                // Premium color palette
                const colors = [
                    { r: 6, g: 182, b: 212 },    // Cyan
                    { r: 59, g: 130, b: 246 },   // Blue
                    { r: 139, g: 92, b: 246 },   // Purple
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.15 + 0.05;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < -this.radius || this.x > w + this.radius) this.vx *= -1;
                if (this.y < -this.radius || this.y > h + this.radius) this.vy *= -1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
                gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            }
        }

        // Particle Network
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;

                // Premium particle colors
                const alpha = Math.random() * 0.4 + 0.2;
                this.color = Math.random() > 0.5
                    ? `rgba(6, 182, 212, ${alpha})`
                    : `rgba(139, 92, 246, ${alpha * 0.8})`;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges for seamless animation
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;

                // Mouse attraction (gentle pull)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance && distance > 0) {
                    const force = (mouseDistance - distance) / mouseDistance;
                    this.x += (dx / distance) * force * 0.3;
                    this.y += (dy / distance) * force * 0.3;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            particles = [];
            orbs = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }

            for (let i = 0; i < orbCount; i++) {
                orbs.push(new Orb(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update orbs first (background layer)
            orbs.forEach(orb => {
                orb.update(canvas.width, canvas.height);
                orb.draw(ctx);
            });

            // Draw particles and connections
            particles.forEach(particle => {
                particle.update(canvas.width, canvas.height);
                particle.draw(ctx);
            });

            // Draw connections between particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.4;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Cursor glow effect
            if (mouse.x > 0 && mouse.y > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
                gradient.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(mouse.x - 100, mouse.y - 100, 200, 200);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobile]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
            style={{
                background: 'radial-gradient(ellipse at top, #0B1021 0%, #020408 50%, #000000 100%)',
            }}
        />
    );
};

export default AnimatedBackground;
