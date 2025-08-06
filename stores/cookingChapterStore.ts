import { CookingChapter } from '@/types/cookingChapter';

export const cookingChapters: CookingChapter[] = [
  {
    "step": 1,
    "title": "재료 준비",
    "status": "completed",
    "statusText": "Completed",
    "time": "May 28, 10:24 AM",
    "checklist": [
      {
        "label": "양파 껍질 벗기기",
        "duration": "1분",
        "checked": true
      },
      {
        "label": "양파 채썰기",
        "duration": "3분",
        "note": "얇게 썰면 좋아요",
        "checked": true
      },
      {
        "label": "당근 다듬기",
        "duration": "2분",
        "checked": true
      }
    ]
  },
  {
    "step": 2,
    "title": "반죽 준비",
    "status": "active",
    "statusText": "In Progress",
    "time": "May 29, 02:15 PM",
    "checklist": [
      {
        "label": "밀가루 체에 걸러두기",
        "duration": "2분",
        "checked": false
      },
      {
        "label": "계란 2개 풀기",
        "duration": "1분",
        "checked": false
      },
      {
        "label": "재료 모두 섞기",
        "duration": "3분",
        "note": "반죽이 너무 묽지 않게 조절",
        "checked": false
      }
    ]
  },
  {
    "step": 3,
    "title": "조리하기",
    "status": "pending",
    "statusText": "Pending",
    "time": "Estimated: May 30",
    "checklist": [
      {
        "label": "팬에 기름 두르기",
        "duration": "1분"
      },
      {
        "label": "반죽을 팬에 붓기",
        "duration": "2분"
      },
      {
        "label": "양면 노릇하게 굽기",
        "duration": "3~4분",
        "note": "중불에서 익히기"
      }
    ]
  }
];
