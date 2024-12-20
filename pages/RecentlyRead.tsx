import React from 'react';
import {
  Image, View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar,TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserData } from '../Context/UserContext';
import { Book, useRecentReadsViewModel } from '../ViewsModel/RecentlyVM';

const BookItem = ({
  img_link,
  title,
  latestChapter,
  lastReadChapter,
  onPress,
  isDeleteMode,
  onDelete,
}: {
  img_link: string;
  title: string;
  latestChapter: number;
  lastReadChapter: number;
  onPress: () => void;
  isDeleteMode: boolean;
  onDelete: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    {isDeleteMode && (
      <TouchableOpacity onPress={onDelete} style={styles.deleteIconContainer}>
        <MaterialIcons name="remove-circle" size={24} color="red" />
      </TouchableOpacity>
    )}
    <View style={styles.horizontalLayout}>
      <Image
        source={{ uri: img_link || 'https://via.placeholder.com/150' }}
        style={styles.bookImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.progress}>
          Đã đọc: {lastReadChapter}/{latestChapter}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const RecentReadsScreen = () => {
  const navigation = useNavigation();
  const { userData, setUserData } = useUserData();
  const {
    recentReads,
    loading,
    isDeleteMode,
    deleteBook,
    toggleDeleteMode,
  } = useRecentReadsViewModel(userData);

  const handlePressBook = (book: Book) => {
    setUserData(userData, book.BookID, null)
    navigation.navigate('Read');
  };

  const handleDeleteBook = (bookID: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa mục này không?', [
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteBook(bookID),
      },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Truyện vừa đọc</Text>
        <TouchableOpacity onPress={toggleDeleteMode}>
          <Text style={styles.delete}>{isDeleteMode ? 'Hủy' : 'Xóa'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#009FE3" style={styles.loader} />
      ) : (
        <FlatList
          data={recentReads}
          keyExtractor={(item) => item.BookID}
          renderItem={({ item }) => (
            <BookItem
              img_link={item.img_link}
              title={item.title}
              latestChapter={item.latest_chapter_number}
              lastReadChapter={item.lastReadChapter}
              onPress={() => handlePressBook(item)}
              isDeleteMode={isDeleteMode}
              onDelete={() => handleDeleteBook(item.BookID)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có truyện nào vừa đọc.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#009FE3',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  delete: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  deleteIconContainer: {
    marginRight: 10,
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  progress: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});