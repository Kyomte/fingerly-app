import { Routine } from './index';

export type RootStackParamList = {
  Tabs: undefined;
  Timer: { routine: Routine };
};

export type TabParamList = {
  WorkoutTab: undefined;
  PresetsTab: undefined;
  HistoryTab: undefined;
};
