import { Youtube, BookOpen, GraduationCap, ExternalLink } from 'lucide-react';

interface PlatformIconProps {
  platform: 'YouTube' | 'Udemy' | 'Coursera' | 'Unacademy' | 'Other';
  className?: string;
}

const PlatformIcon = ({ platform, className = 'w-5 h-5' }: PlatformIconProps) => {
  switch (platform) {
    case 'YouTube':
      return <Youtube className={`${className} text-red-500`} />;
    case 'Udemy':
      return (
        <div className={`${className} bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold`}>
          U
        </div>
      );
    case 'Coursera':
      return <BookOpen className={`${className} text-blue-500`} />;
    case 'Unacademy':
      return <GraduationCap className={`${className} text-green-500`} />;
    default:
      return <ExternalLink className={`${className} text-muted-foreground`} />;
  }
};

export default PlatformIcon;
