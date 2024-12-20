import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
    Auth: undefined;
    Inapp: NavigatorScreenParams<TabParamList>;
    BookInfor: {
      UserName : string;
      BookID: string;
      title: string;
      author: string;
      genre: string[];
      description: string;
      latest_chapter_number: number;
    };
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};
