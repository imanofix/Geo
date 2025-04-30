import { createContext, ReactNode, useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

type Achievement = {
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
};

type AvatarOption = {
  id: string;
  name: string;
  url: string;
};

type User = {
  name: string;
  joinDate: string;
  points: number;
  cardsStudied: number;
  accuracy: string;
  level: number;
  title: string;
  progress: number;
  avatar: string;
  unlockedAvatars: string[];
  achievements: string[];
};

type UserContextType = {
  user: User | null;
  updatePoints: (points: number) => void;
  updateStudiedCards: () => void;
  changeAvatar: (avatarId: string) => void;
  achievements: Achievement[];
  avatars: AvatarOption[];
};

// Available achievements
const achievementsList: Achievement[] = [
  {
    title: "Географ-новичок",
    description: "Начало географического путешествия!",
    pointsRequired: 0,
    icon: "🌍"
  },
  {
    title: "Путешественник",
    description: "Изучение стран и столиц.",
    pointsRequired: 50,
    icon: "🧭"
  },
  {
    title: "Исследователь",
    description: "Прогресс в изучении мировой географии.",
    pointsRequired: 100,
    icon: "🗺️"
  },
  {
    title: "Картограф",
    description: "Мастерство в географических знаниях.",
    pointsRequired: 200,
    icon: "🧠"
  },
  {
    title: "Географ-эксперт",
    description: "Высший уровень знания мировой географии!",
    pointsRequired: 500,
    icon: "👨‍🎓"
  }
];

// Available avatars
const avatarsList: AvatarOption[] = [
  {
    id: "default",
    name: "Default",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Felix"
  },
  {
    id: "explorer",
    name: "Explorer",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Peanut"
  },
  {
    id: "traveler",
    name: "Traveler",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Mimi"
  },
  {
    id: "geographer",
    name: "Geographer",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Daisy"
  },
  {
    id: "master",
    name: "Master",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Abby"
  }
];

const initialUser: User = {
  name: 'Sarah Johnson',
  joinDate: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }),
  points: 0,
  cardsStudied: 0,
  accuracy: '0%',
  level: 1,
  title: "Географ-новичок",
  progress: 0,
  avatar: "default",
  unlockedAvatars: ["default"],
  achievements: []
};

// Create context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  updatePoints: () => {},
  updateStudiedCards: () => {},
  changeAvatar: () => {},
  achievements: [],
  avatars: []
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User>('geoOzgeUser', initialUser);
  const [totalAnswers, setTotalAnswers] = useLocalStorage<number>('geoOzgeTotalAnswers', 0);
  const [correctAnswers, setCorrectAnswers] = useLocalStorage<number>('geoOzgeCorrectAnswers', 0);

  // Check for level-ups and title changes based on points
  useEffect(() => {
    if (!user) return;
    
    // Find the highest achievement unlocked based on points
    const highestAchievement = [...achievementsList]
      .reverse()
      .find(achievement => user.points >= achievement.pointsRequired);
    
    if (highestAchievement && highestAchievement.title !== user.title) {
      // User unlocked a new title
      const newAchievements = [...user.achievements];
      if (!newAchievements.includes(highestAchievement.title)) {
        newAchievements.push(highestAchievement.title);
      }
      
      // Calculate level and progress to next level
      const currentLevel = Math.floor(user.points / 100) + 1;
      const progressToNextLevel = (user.points % 100);
      
      // Unlock avatar if applicable
      let newUnlockedAvatars = [...user.unlockedAvatars];
      
      if (user.points >= 50 && !newUnlockedAvatars.includes("explorer")) {
        newUnlockedAvatars.push("explorer");
      }
      if (user.points >= 100 && !newUnlockedAvatars.includes("traveler")) {
        newUnlockedAvatars.push("traveler");
      }
      if (user.points >= 200 && !newUnlockedAvatars.includes("geographer")) {
        newUnlockedAvatars.push("geographer");
      }
      if (user.points >= 500 && !newUnlockedAvatars.includes("master")) {
        newUnlockedAvatars.push("master");
      }
      
      setUser({
        ...user,
        title: highestAchievement.title,
        level: currentLevel,
        progress: progressToNextLevel,
        achievements: newAchievements,
        unlockedAvatars: newUnlockedAvatars
      });
    } else {
      // Just update level and progress
      const currentLevel = Math.floor(user.points / 100) + 1;
      const progressToNextLevel = (user.points % 100);
      
      if (user.level !== currentLevel || user.progress !== progressToNextLevel) {
        setUser({
          ...user,
          level: currentLevel,
          progress: progressToNextLevel
        });
      }
    }
  }, [user?.points, setUser]);
  
  // Update accuracy whenever total or correct answers change
  useEffect(() => {
    if (!user || totalAnswers === 0) return;
    
    const accuracy = Math.round((correctAnswers / totalAnswers) * 100);
    setUser({
      ...user,
      accuracy: `${accuracy}%`
    });
  }, [totalAnswers, correctAnswers, setUser, user]);

  const updatePoints = (points: number) => {
    if (!user) return;
    
    setUser({
      ...user,
      points: user.points + points
    });
    
    if (points > 0) {
      setCorrectAnswers(correctAnswers + 1);
    }
    setTotalAnswers(totalAnswers + 1);
  };

  const updateStudiedCards = () => {
    if (!user) return;
    
    setUser({
      ...user,
      cardsStudied: user.cardsStudied + 1
    });
  };
  
  const changeAvatar = (avatarId: string) => {
    if (!user || !user.unlockedAvatars.includes(avatarId)) return;
    
    setUser({
      ...user,
      avatar: avatarId
    });
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updatePoints, 
        updateStudiedCards, 
        changeAvatar,
        achievements: achievementsList,
        avatars: avatarsList
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
