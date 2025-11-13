import { AnimatedPage } from "@/components/common/AnimatedPage";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rss, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";

export default function Feed() {
  const { ref, inView } = useInView();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold">Latest Updates</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest NEP resources and insights
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-60" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Card key={post.id} ref={index === posts.length - 1 ? ref : undefined}>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.created_at), "MMMM d, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{post.content}</p>
                    {post.cta_text && post.cta_link && (
                      <Button asChild>
                        <a href={post.cta_link} target="_blank" rel="noopener noreferrer">
                          {post.cta_text}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Rss}
              title="No updates yet"
              description="Check back soon for new content and resources"
            />
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
