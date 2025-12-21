import { Calendar } from 'lucide-react';
import { formatHebrewDateFull } from '../../lib/hebrewDate';
import { useEffect, useState } from 'react';

interface HebrewDateDisplayProps {
  className?: string;
  showIcon?: boolean;
}

export function HebrewDateDisplay({ className = '', showIcon = true }: HebrewDateDisplayProps) {
  const [hebrewDate, setHebrewDate] = useState('');
  
  useEffect(() => {
    // Update date on mount
    setHebrewDate(formatHebrewDateFull());
    
    // Update date at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setHebrewDate(formatHebrewDateFull());
      // Set up daily interval
      const interval = setInterval(() => {
        setHebrewDate(formatHebrewDateFull());
      }, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      {showIcon && <Calendar className="h-4 w-4" />}
      <span>{hebrewDate}</span>
    </div>
  );
}

