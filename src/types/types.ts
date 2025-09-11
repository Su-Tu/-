// 语录卡片
export interface WordCard {
  id: number;
  imgurl: string;
  word: string;
  animateName: string;
  author: string;
  gradientColors?: string[];
  shadowColor: string;
  isView: boolean;
}


// 占卜卡片
export interface DivinationCard {
  id: number;
  name: string;
  direction: 'Upright' | 'Reversed';
  url: string;  
}

// 用户信息
export interface UserInfo {
  name: string;
  avatarImage:string
  attention: number;
  fan: number;
  praise: number;
  signature: string;
  bgImage: string;
}


// 评论
export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  praise: number;
  time: string;
  isPraise: boolean;
}

export interface PostContent {
  type: 'text' | 'image';
  content: string; // 文本内容或图片URL
  style?: {};  // 可选样式
}

// 详情页面
export interface DetailOption {
  type:'帖子'|'壁纸'|'语录'|'占卜'
  id: number;
  title: string;
  author: string;
  author_avatar: string;
  time: string;
  praise: number;
  attention: number;
  content: '';
  commentList: Comment[];
}

export interface PopOptions {
  visible: boolean;
  text?: string;
  option?: Partial<{  // 使用 Partial 表示可选覆盖
    type?: 'message' | 'tip' | 'Input';
    position?: 'middle' | 'bottom';
    title?: string;
    titleIcon?: string;
    titleIconStyle: {};
    content?: string;
    contentIcon?: string;
    contentIconStyle?: {};
    cancelButton?: { isShow?: boolean, text?: string, style?: {} };
    ensureButton?: { isShow?: boolean, text?: string, style?: {} };
  }>;
}



export interface ChatBlock {
  TalkPeople: string;
  TalkContent: string;
  time: string;
}

export interface ChatOption {
  avatarUrl: string; // 头像url
  chatName: string;
  chatBlock: ChatBlock[];
  noRead: number;
}