import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Flag, MessageSquare, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface FlaggedPost {
  id: string;
  reason: string;
  created_at: string;
  post_id: string;
  user_id: string;
  post: {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  };
  flagger: {
    name: string;
    email: string;
  };
}

export function ModerationPanel() {
  const [selectedTab, setSelectedTab] = useState('flags');
  const queryClient = useQueryClient();

  const { data: flags, isLoading } = useQuery({
    queryKey: ['post-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_flags')
        .select(`
          id,
          reason,
          created_at,
          post_id,
          user_id,
          community_posts!inner (
            id,
            content,
            user_id,
            created_at
          ),
          profiles!post_flags_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['post-flags'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const dismissFlagMutation = useMutation({
    mutationFn: async (flagId: string) => {
      const { error } = await supabase
        .from('post_flags')
        .delete()
        .eq('id', flagId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Flag dismissed' });
      queryClient.invalidateQueries({ queryKey: ['post-flags'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to dismiss flag',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleDismissFlag = async (flagId: string) => {
    dismissFlagMutation.mutate(flagId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Community Moderation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flags" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Flagged Posts ({flags?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="reported" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reported Comments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flags" className="space-y-4 mt-4">
            {!flags || flags.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>No flagged posts to review</p>
              </div>
            ) : (
              flags.map((flag: any) => (
                <Card key={flag.id} className="border-orange-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="destructive" className="mb-2">
                            {flag.reason}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Flagged by {flag.profiles?.name || flag.profiles?.email} on{' '}
                            {format(new Date(flag.created_at), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm mb-2 font-medium">Post Content:</p>
                        <p className="text-sm">{flag.community_posts?.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Posted on {format(new Date(flag.community_posts?.created_at), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(flag.post_id)}
                          disabled={deletePostMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete Post
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDismissFlag(flag.id)}
                          disabled={dismissFlagMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Dismiss Flag
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reported" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Comment moderation coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>User management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
