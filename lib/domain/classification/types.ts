export interface Category {
  id: string;
  channel_address: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

export interface Tag {
  id: string;
  channel_address: string;
  name: string;
  slug: string;
}

export interface ThreadClassification {
  publication_id: string;
  category?: Category;
  tags: Tag[];
}
