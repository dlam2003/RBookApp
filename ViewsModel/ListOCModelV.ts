import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUserData } from '../Context/UserContext';
import { getCurrentChap, GetListOfChap, GetTittleBook } from '../models/ListOfChapterDB';

interface Chapter {
  title: string;
  ChapterID: string;
}

export const useChapterViewModel = () => {
  const navigation = useNavigation();
  const { userData, BookID, setUserData } = useUserData();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [TitleBook, setTitLeBook] = useState<string>('');
  const [CurrentChap, setCurrentChap] = useState<number | null>(null);

  useEffect(() => {
    fetchChapters();
  }, [CurrentChap]);

  const fetchChapters = async () => {
    try {
      setLoading(true);

      const TitleBook = await GetTittleBook(BookID);
      setTitLeBook(TitleBook);

      const currentChapNumber = await getCurrentChap(userData, BookID);
      setCurrentChap(currentChapNumber);
      console.log('currentchap VM',CurrentChap);
      const chapterList = await GetListOfChap(BookID);
      if (chapterList) {
        const chaptersData = chapterList.map((chapter: any, index: number) => ({
          title: chapter,
          ChapterID: `Chương ${index + 1}`,
        }));
        setChapters(chaptersData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chương: ', error);
    } finally {
      setLoading(false);
    }
  };

  const NextToRead = (chapternumber: string) => {
    setUserData(userData, BookID, chapternumber);
    navigation.navigate('ReadChapter');
  };

  return {
    TitleBook,
    chapters,
    loading,
    CurrentChap,
    fetchChapters,
    NextToRead,
  };
};