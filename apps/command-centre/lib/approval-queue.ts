// Shared approval queue utility for newsjacking system

// In-memory storage for approval queue (would be database in production)
let approvalQueue: any[] = [];

export function getApprovalQueue() {
  return approvalQueue;
}

export function setApprovalQueue(queue: any[]) {
  approvalQueue = queue;
}

// Add content to approval queue (called from content generation)
export async function addToApprovalQueue(contentData: any) {
  const queueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    contentId: contentData.id,
    platform: 'multi', // Will be split into individual platform items
    generatedContent: contentData.multiPlatformContent,
    originalStory: contentData.originalStory,
    audioIntelAngle: contentData.unsignedAngle?.angle,
    urgency: contentData.unsignedAngle?.urgency || 'medium',
    relevanceScore: contentData.originalStory?.relevanceScore || 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    readyToPost: false
  };

  // Create separate queue items for each platform
  const platforms = ['twitter', 'linkedin', 'instagram'];
  platforms.forEach(platform => {
    if (contentData.multiPlatformContent[platform]) {
      approvalQueue.push({
        ...queueItem,
        id: `${queueItem.id}_${platform}`,
        platform,
        generatedContent: contentData.multiPlatformContent[platform]
      });
    }
  });

  return queueItem;
}
