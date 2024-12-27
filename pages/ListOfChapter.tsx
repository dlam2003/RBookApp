import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useChapterViewModel } from '../ViewsModel/ListOCModelV';

export const ListChapterView = () => {
  const navigation = useNavigation();
  const {
    TitleBook,
    chapters,
    loading,
    CurrentChap,
    fetchChapters,
    NextToRead
  } = useChapterViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{TitleBook}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#009FE3" style={styles.loader} />
      ) : chapters && chapters.length > 0 ? (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.ChapterID.toString()}  // Ensure ChapterID is a string or unique identifier
          contentContainerStyle={{ paddingTop: 40 }}
          initialScrollIndex={Math.max(
            0,
            Math.min(
              chapters.length - 1,
              (CurrentChap || 0) - 8  // Fix to handle null or undefined CurrentChap
            )
          )}
          getItemLayout={(data, index) => ({
            length: 56,
            offset: 56 * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                CurrentChap && CurrentChap === index + 1
                  ? styles.highlightedItem
                  : styles.normalItem,
              ]}
              onPress={() => NextToRead((index + 1).toString())}
            >
              <Text
                style={[
                  styles.title,
                  CurrentChap && CurrentChap === index + 1
                    ? styles.highlightedText
                    : styles.normalText,
                ]}
              >
                {`#${index + 1}: ${item.title}`}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có chương nào.</Text>
          }
        />
      ) : (
        <Text style={styles.emptyText}>Không có dữ liệu chương.</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009FE3',
    paddingVertical: 15,
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight || 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1000,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  highlightedItem: {
    backgroundColor: '#E6F7FF',
  },
  normalItem: {
    backgroundColor: '#FFFFFF',
  },
  highlightedText: {
    color: '#009FE3',
    fontWeight: 'bold',
  },
  normalText: {
    color: '#999999',
  },
  title: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});