import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, Menu, MessageSquare, Heart, Bookmark, Share2, 
  MoreHorizontal, ChevronDown, Check, AlertCircle, X, Trash2, Edit2, Shield, Settings,
  Image as ImageIcon, Video, Link as LinkIcon, Bold, Italic, List, User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENTS ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg' | 'icon' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-card text-card-foreground border border-border hover:bg-muted': variant === 'secondary',
            'bg-muted text-foreground hover:bg-muted/80': variant === 'tertiary',
            'bg-danger text-white hover:bg-danger/90': variant === 'danger',
            'hover:bg-muted text-muted-foreground hover:text-foreground': variant === 'ghost',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

const Avatar = ({ src, alt, size = 'md', className }: { src?: string, alt?: string, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-muted", 
      size === 'sm' && "h-8 w-8",
      size === 'md' && "h-10 w-10",
      size === 'lg' && "h-12 w-12",
      size === 'xl' && "h-24 w-24",
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <UserIcon className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  );
};

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info', className?: string }) => {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", 
      variant === 'default' && "bg-muted text-muted-foreground",
      variant === 'success' && "bg-success/10 text-success",
      variant === 'warning' && "bg-warning/10 text-warning",
      variant === 'danger' && "bg-danger/10 text-danger",
      variant === 'info' && "bg-info/10 text-info",
      className
    )}>
      {children}
    </span>
  );
};

// --- LAYOUT ---

const AppHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Toggle for demo
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for demo

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              01
            </div>
            Blog
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/" className={({isActive}) => cn("transition-colors hover:text-foreground", isActive ? "text-foreground" : "text-muted-foreground")}>Feed</NavLink>
            <NavLink to="/following" className={({isActive}) => cn("transition-colors hover:text-foreground", isActive ? "text-foreground" : "text-muted-foreground")}>Following</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/new" className="hidden sm:inline-flex">
                <Button variant="secondary" size="sm">Create Post</Button>
              </Link>
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
              </Link>
              <div className="relative group">
                <Link to="/profile/me">
                  <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" size="sm" className="cursor-pointer border border-border" />
                </Link>
                {isAdmin && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-sm hidden group-hover:block">
                     <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-muted rounded-md">Admin Area</Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">Log in</Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Create account</Button>
              </Link>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

// --- POST CARD ---

const PostCard = ({ 
  title, author, authorImage, date, excerpt, coverImage, likes, comments, isCompact = false 
}: any) => {
  return (
    <article className={cn("group flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-sm", isCompact ? "" : "mb-6")}>
      {coverImage && !isCompact && (
        <div className="aspect-[2/1] w-full overflow-hidden bg-muted">
          <img src={coverImage} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className={cn("flex flex-col p-5", isCompact && "p-4")}>
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={authorImage} size="sm" />
          <div className="flex flex-col">
            <Link to={`/profile/${author.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium hover:text-primary transition-colors">
              {author}
            </Link>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
        
        <Link to="/post/123" className="block">
          <h2 className={cn("font-bold text-foreground hover:text-primary transition-colors mb-2", isCompact ? "text-lg" : "text-2xl")}>
            {title}
          </h2>
          {!isCompact && excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-4">
              {excerpt}
            </p>
          )}
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </button>
            <Link to="/post/123#comments" className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>{comments}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

// --- PAGES ---

const Feed = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_280px] gap-8">
        
        <aside className="hidden md:block">
          <nav className="flex flex-col gap-2 sticky top-24">
            <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border text-foreground font-medium shadow-sm">
              <List className="h-5 w-5 text-primary" />
              Explore
            </Link>
            <Link to="/following" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium transition-colors">
              <UserIcon className="h-5 w-5" />
              Following
            </Link>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="flex items-center gap-4 border-b border-border pb-4 mb-6 md:hidden">
            <Link to="/" className="text-foreground font-semibold border-b-2 border-primary pb-4 -mb-[18px]">Explore</Link>
            <Link to="/following" className="text-muted-foreground hover:text-foreground font-medium pb-4 -mb-[18px]">Following</Link>
          </div>

          <div className="flex flex-col gap-6">
            <PostCard 
              title="Building a Modern Web Application Architecture in 2024"
              author="Alex Rivers"
              authorImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"
              date="Oct 24"
              excerpt="An exploration of how we structure our frontend monoliths using React, Tailwind, and a robust design system to maintain velocity."
              coverImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
              likes={128}
              comments={34}
            />
            <PostCard 
              title="Understanding React Server Components"
              author="Sam Chen"
              authorImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop"
              date="Oct 23"
              excerpt="A deep dive into how Server Components change the way we think about data fetching and rendering in React applications."
              likes={89}
              comments={12}
            />
            <PostCard 
              title="The art of API design"
              author="Elena Rodriguez"
              authorImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
              date="Oct 21"
              excerpt="Designing APIs that developers actually want to use requires more than just following REST principles."
              likes={256}
              comments={45}
            />
          </div>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h3 className="font-bold mb-4">Trending Community</h3>
            <div className="flex flex-col gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&q=${i}`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Developer #{i}</span>
                      <span className="text-xs text-muted-foreground">Software Engineer</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const PostDetail = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="aspect-[2.5/1] w-full overflow-hidden bg-muted">
          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop" alt="Cover" className="w-full h-full object-cover" />
        </div>
        
        <div className="px-6 py-8 md:px-12 md:py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" size="lg" />
              <div className="flex flex-col">
                <Link to="/profile/alex" className="font-semibold text-foreground hover:text-primary transition-colors">Alex Rivers</Link>
                <span className="text-sm text-muted-foreground">Published on Oct 24 • 5 min read</span>
              </div>
            </div>
            <Button variant="secondary">Subscribe</Button>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-foreground leading-tight">
            Building a Modern Web Application Architecture in 2024
          </h1>

          <div className="prose prose-neutral max-w-none text-foreground/90 font-sans leading-relaxed">
            <p className="text-lg mb-6">
              When we started rebuilding our core platform last year, we knew we needed to make some fundamental changes to our architecture. The legacy system had served us well, but technical debt was slowing down our feature delivery.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">The Monolith vs Microservices Debate</h2>
            <p className="mb-6">
              We spent weeks debating whether to break our monolithic frontend into micro-frontends. Ultimately, we decided that for our team size, a well-structured monolith provided the best balance of velocity and maintainability.
            </p>
            <div className="bg-[#1e1e1e] rounded-xl p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-[#d4d4d4] font-mono"><code>
{`function ArchitectureDecision() {
  const teamSize = 15;
  const complexity = 'high';
  
  if (teamSize < 20) {
    return 'Structured Monolith';
  }
  return 'Micro-frontends';
}`}
              </code></pre>
            </div>
            <h3 className="text-xl font-bold mt-8 mb-4 text-foreground">Implementing the Design System</h3>
            <p className="mb-6">
              One of our best decisions was investing early in a comprehensive design system using Tailwind CSS. By establishing a clear set of design tokens and reusable components, we drastically reduced the time spent arguing about padding and hex codes.
            </p>
          </div>
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
              <Heart className="h-5 w-5" />
              <span>128 Likes</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>34 Comments</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Bookmark className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
          </div>
        </div>
      </article>

      <section id="comments" className="mt-12 bg-card border border-border rounded-xl p-6 md:p-10">
        <h3 className="text-2xl font-bold mb-8">Discussion (34)</h3>
        
        <div className="flex gap-4 mb-10">
          <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" />
          <div className="flex-1 flex flex-col gap-3">
            <textarea 
              className="w-full bg-transparent border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
              placeholder="Add to the discussion..."
            />
            <div className="flex justify-end">
              <Button>Post Comment</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-4">
              <Avatar src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=${i}`} />
              <div className="flex-1">
                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Developer #{i}</span>
                      <span className="text-xs text-muted-foreground">Oct 24</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-sm text-foreground/90">
                    This is a really insightful post. We went through a similar debate last year and ended up with a slightly different architecture, but the core principles remain the same. The design system point is spot on!
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 px-2">
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Heart className="h-3.5 w-3.5" /> 12
                  </button>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CreatePost = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col min-h-[70vh]">
        
        <div className="p-6 md:p-10 flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="secondary" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Add a cover image
            </Button>
          </div>
          
          <input 
            type="text" 
            placeholder="New post title here..."
            className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50 mb-8 tracking-tight"
          />
          
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border mb-4 overflow-x-auto">
            <Button variant="ghost" size="sm" className="h-8"><Bold className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8"><Italic className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8"><LinkIcon className="h-4 w-4" /></Button>
            <div className="w-px h-4 bg-border mx-2" />
            <Button variant="ghost" size="sm" className="h-8"><List className="h-4 w-4" /></Button>
            <div className="w-px h-4 bg-border mx-2" />
            <Button variant="ghost" size="sm" className="h-8"><ImageIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8"><Video className="h-4 w-4" /></Button>
          </div>
          
          <textarea 
            className="w-full flex-1 bg-transparent border-none focus:outline-none text-lg resize-none placeholder:text-muted-foreground"
            placeholder="Write your post content here... (Markdown supported)"
          />
        </div>
        
        <div className="border-t border-border bg-muted/30 p-4 md:px-10 flex items-center gap-4">
          <Button size="lg">Publish</Button>
          <Button variant="ghost">Save draft</Button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="h-32 md:h-48 bg-primary/10 relative">
           <div className="absolute -bottom-12 left-6 md:left-10 p-1 bg-card rounded-full">
             <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop" size="xl" />
           </div>
        </div>
        <div className="px-6 md:px-10 pt-16 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Alex Rivers</h1>
            <p className="text-muted-foreground font-medium mb-4">Frontend Engineer @ TechCorp</p>
            <p className="text-sm max-w-lg leading-relaxed">
              Passionate about React, design systems, and building accessible user interfaces. Documenting my learning journey and sharing insights along the way.
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined Oct 2023</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[140px]">
            <Button className="w-full">Subscribe</Button>
            <Button variant="secondary" className="w-full">Edit Profile</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        <main>
          <h3 className="text-xl font-bold mb-6">Recent Posts</h3>
          <div className="flex flex-col gap-6">
            <PostCard 
              title="Building a Modern Web Application Architecture in 2024"
              author="Alex Rivers"
              authorImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"
              date="Oct 24"
              isCompact
              likes={128}
              comments={34}
            />
            <PostCard 
              title="My journey into WebGL"
              author="Alex Rivers"
              authorImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"
              date="Sep 12"
              isCompact
              likes={56}
              comments={8}
            />
          </div>
        </main>
        <aside>
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
             <h4 className="font-bold mb-4">Stats</h4>
             <div className="flex flex-col gap-3 text-sm">
               <div className="flex justify-between"><span className="text-muted-foreground">Subscribers</span><span className="font-medium">1.2k</span></div>
               <div className="flex justify-between"><span className="text-muted-foreground">Total posts</span><span className="font-medium">45</span></div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Dummy icons for profile
const MapPin = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const Calendar = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>

const Login = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center">
      <div className="w-full bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary text-primary-foreground p-2 rounded-lg font-bold text-2xl tracking-tight mb-4">
            01
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Log in to your account to continue</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="email" placeholder="you@example.com" className="w-full bg-transparent border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="password" placeholder="••••••••" className="w-full bg-transparent border border-border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <EyeOff className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <Button size="lg" className="w-full mt-2">Log in</Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center">
      <div className="w-full bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary text-primary-foreground p-2 rounded-lg font-bold text-2xl tracking-tight mb-4">
            01
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-muted-foreground text-sm">Join the developer community</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" placeholder="Alex Rivers" className="w-full bg-transparent border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="email" placeholder="you@example.com" className="w-full bg-transparent border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="password" placeholder="••••••••" className="w-full bg-transparent border border-border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
          
          <Button size="lg" className="w-full mt-2">Sign up</Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <Button variant="ghost" size="sm">Mark all as read</Button>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={cn("p-5 flex gap-4 transition-colors hover:bg-muted/30", i <= 2 ? "bg-primary/5" : "")}>
            <Avatar src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=${i}`} />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Developer #{i}</span> 
                <span className="text-muted-foreground"> {i % 2 === 0 ? 'liked your post' : 'commented on'} </span>
                <Link to="/post/123" className="font-medium text-foreground hover:text-primary transition-colors">
                  Building a Modern Web Application Architecture
                </Link>
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {i} hour{i > 1 ? 's' : ''} ago
              </span>
            </div>
            {i <= 2 && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminShell = ({ children, activeTab }: { children: React.ReactNode, activeTab: 'users' | 'posts' | 'reports' }) => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
             <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Area</div>
             <Link to="/admin" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors", activeTab === 'users' ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>
               <UserIcon className="h-5 w-5" /> Users
             </Link>
             <Link to="/admin/posts" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors", activeTab === 'posts' ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>
               <FileText className="h-5 w-5" /> Posts
             </Link>
             <Link to="/admin/reports" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors", activeTab === 'reports' ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}>
               <Flag className="h-5 w-5" /> Reports
             </Link>
          </nav>
        </aside>
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  return (
    <AdminShell activeTab="users">
      <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search users..." className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=${i}`} />
                        <div className="flex flex-col">
                          <span className="font-medium">User {i}</span>
                          <span className="text-muted-foreground text-xs">user{i}@example.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={i === 3 ? "danger" : "success"}>{i === 3 ? 'Banned' : 'Active'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </AdminShell>
  );
};

const AdminPosts = () => {
  return (
    <AdminShell activeTab="posts">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Manage Posts</h1>
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search posts..." className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium max-w-[300px] truncate">
                  Understanding React Server Components
                </td>
                <td className="px-6 py-4 text-muted-foreground">Alex Rivers</td>
                <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
                <td className="px-6 py-4 text-right">
                   <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
};

const AdminReports = () => {
  return (
    <AdminShell activeTab="reports">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Manage Reports</h1>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Reported User</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[1,2,3].map(i => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">User {i}</td>
                <td className="px-6 py-4 text-muted-foreground">User {i+5}</td>
                <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">Spam / Inappropriate content behavior on latest post...</td>
                <td className="px-6 py-4 text-right">
                   <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <AppHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/following" element={<Feed />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/new" element={<CreatePost />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="*" element={<div className="p-8 text-center text-muted-foreground">Page not implemented in prototype</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
