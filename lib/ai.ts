// AI 功能已全部禁用

// 占位函数，避免导入错误
export async function generateEmbedding(_text: string): Promise<number[]> {
  throw new Error("AI 功能已禁用");
}

export function cosineSimilarity(_vecA: number[], _vecB: number[]): number {
  throw new Error("AI 功能已禁用");
}

export async function generateSummary(_title: string, _content: string): Promise<string> {
  throw new Error("AI 功能已禁用");
}

export async function groupNotesByTopics(_notes: Array<{ id: number; title: string; content: string }>): Promise<Array<{ topic: string; noteIds: number[] }>> {
  return [];
}

export async function semanticSearch(_query: string, _noteEmbeddings: Array<{ noteId: number; embedding: number[]; title: string; content: string }>, _topK: number = 5): Promise<Array<{ noteId: number; score: number; title: string; content: string }>> {
  return [];
}