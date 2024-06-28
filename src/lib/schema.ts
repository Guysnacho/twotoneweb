export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			comment: {
				Row: {
					content: string;
					created_at: string;
					dislikes: number;
					id: string;
					likes: number;
					review_id: string;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					content: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					review_id: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					review_id?: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'comment_review_id_fkey';
						columns: ['review_id'];
						isOneToOne: false;
						referencedRelation: 'review';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			followers: {
				Row: {
					followed_at: string;
					followee_id: string;
					follower_id: string;
				};
				Insert: {
					followed_at?: string;
					followee_id: string;
					follower_id: string;
				};
				Update: {
					followed_at?: string;
					followee_id?: string;
					follower_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'follower';
						columns: ['follower_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'followers_followee_id_fkey';
						columns: ['followee_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			installs: {
				Row: {
					expo_tokens: string[] | null;
					user_id: string;
				};
				Insert: {
					expo_tokens?: string[] | null;
					user_id: string;
				};
				Update: {
					expo_tokens?: string[] | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'installs_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			review: {
				Row: {
					content: string;
					created_at: string;
					dislikes: number;
					id: string;
					likes: number;
					song_id: string;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					content: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					song_id: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					song_id?: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'review_song_id_fkey';
						columns: ['song_id'];
						isOneToOne: false;
						referencedRelation: 'song';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'review_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			service_tokens: {
				Row: {
					expired_at: number;
					id: number;
					issued_at: number;
					token: string;
				};
				Insert: {
					expired_at: number;
					id?: never;
					issued_at: number;
					token: string;
				};
				Update: {
					expired_at?: number;
					id?: never;
					issued_at?: number;
					token?: string;
				};
				Relationships: [];
			};
			song: {
				Row: {
					album: string;
					album_art: string;
					artists: string;
					created_at: string;
					dislikes: number;
					explicit: boolean;
					id: string;
					likes: number;
					preview_url: string | null;
					service_id: string;
					service_name: Database['public']['Enums']['service_name'];
					stream_url: string | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					album: string;
					album_art: string;
					artists: string;
					created_at?: string;
					dislikes?: number;
					explicit?: boolean;
					id?: string;
					likes?: number;
					preview_url?: string | null;
					service_id: string;
					service_name?: Database['public']['Enums']['service_name'];
					stream_url?: string | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					album?: string;
					album_art?: string;
					artists?: string;
					created_at?: string;
					dislikes?: number;
					explicit?: boolean;
					id?: string;
					likes?: number;
					preview_url?: string | null;
					service_id?: string;
					service_name?: Database['public']['Enums']['service_name'];
					stream_url?: string | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			sotd: {
				Row: {
					content: string;
					created_at: string;
					dislikes: number;
					id: string;
					likes: number;
					service_name: Database['public']['Enums']['service_name'] | null;
					song_id: string;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					content: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					service_name?: Database['public']['Enums']['service_name'] | null;
					song_id: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string;
					dislikes?: number;
					id?: string;
					likes?: number;
					service_name?: Database['public']['Enums']['service_name'] | null;
					song_id?: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_sotd_song_id_fkey';
						columns: ['song_id'];
						isOneToOne: false;
						referencedRelation: 'song';
						referencedColumns: ['service_id'];
					},
					{
						foreignKeyName: 'public_sotd_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sotd_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			sotd_likes: {
				Row: {
					created_at: string;
					sotd_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					sotd_id: string;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					sotd_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'like_dislike_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			support_tickets: {
				Row: {
					created_at: string;
					description: string;
					email: string;
					email_error: string | null;
					id: number;
					platform: string;
					type: string | null;
					username: string | null;
				};
				Insert: {
					created_at?: string;
					description: string;
					email: string;
					email_error?: string | null;
					id?: number;
					platform: string;
					type?: string | null;
					username?: string | null;
				};
				Update: {
					created_at?: string;
					description?: string;
					email?: string;
					email_error?: string | null;
					id?: number;
					platform?: string;
					type?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
			type_lookup: {
				Row: {
					content_type: number;
					created_at: string;
					id: number;
					type_description: string;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					content_type: number;
					created_at?: string;
					id?: number;
					type_description: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					content_type?: number;
					created_at?: string;
					id?: number;
					type_description?: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'type_lookup_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			users: {
				Row: {
					about: string | null;
					avatar_url: string | null;
					id: string;
					role: 'STOCK' | 'CURATOR' | 'ADMIN';
					username: string | null;
				};
				Insert: {
					about?: string | null;
					avatar_url?: string | null;
					id: string;
					role?: 'STOCK' | 'CURATOR' | 'ADMIN';
					username?: string | null;
				};
				Update: {
					about?: string | null;
					avatar_url?: string | null;
					id?: string;
					role?: 'STOCK' | 'CURATOR' | 'ADMIN';
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'users_user_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_sotd_w_following_user_id: {
				Args: {
					persona: string;
				};
				Returns: {
					id: string;
					content: string;
					created_at: string;
					song: Json;
					user: Json;
					following: boolean;
				}[];
			};
			search_songs: {
				Args: {
					prefix: string;
				};
				Returns: {
					album: string;
					album_art: string;
					artists: string;
					created_at: string;
					dislikes: number;
					explicit: boolean;
					id: string;
					likes: number;
					preview_url: string | null;
					service_id: string;
					service_name: Database['public']['Enums']['service_name'];
					stream_url: string | null;
					title: string;
					updated_at: string;
				}[];
			};
			search_users: {
				Args: {
					prefix: string;
				};
				Returns: {
					about: string | null;
					avatar_url: string | null;
					id: string;
					role: 'STOCK' | 'CURATOR' | 'ADMIN';
					username: string | null;
				}[];
			};
		};
		Enums: {
			app_role: 'STOCK' | 'CURATOR' | 'ADMIN';
			service_name: 'SPOTIFY' | 'APPLE' | 'SOUNDCLOUD';
			user_status: 'ONLINE' | 'OFFLINE' | 'LISTENING';
		};
		CompositeTypes: {
			sotd_result: {
				id: string | null;
				content: string | null;
				created_at: string | null;
				song: Json | null;
				user: Json | null;
			};
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
	? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;
