export function createTimeFrameExtractor(selectedTimeFrame: string | undefined) {
  return (sectionKey?: string) => selectedTimeFrame;
}
