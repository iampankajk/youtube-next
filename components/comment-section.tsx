"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchComments } from "@/lib/api";
import type { Comment } from "@/types";

type CommentSectionProps = {
  videoId: string;
};

/**
 *
 * @param root0
 * @param root0.videoId
 */
export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchComments(videoId)
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [videoId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // In a real app, you would send this to your API
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      text: commentText,
      authorDisplayName: "Current User",
      authorProfileImageUrl: "/placeholder.svg?height=40&width=40",
      likeCount: 0,
      publishedAt: new Date().toISOString(),
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  if (loading) {
    return <div className="py-4 text-center">Loading comments...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="mb-4 font-medium">{comments.length} Comments</h3>

      <form onSubmit={handleAddComment} className="mb-6 flex gap-4">
        <div className="size-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="Your profile"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="resize-none"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={!commentText.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="size-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={comment.authorProfileImageUrl || "/placeholder.svg"}
                alt={comment.authorDisplayName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.authorDisplayName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.publishedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="mt-1">{comment.text}</p>
              <div className="mt-2 flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsUp className="mr-2 size-4" />
                  {comment.likeCount}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsDown className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  Reply
                </Button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="size-8 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={
                            reply.authorProfileImageUrl || "/placeholder.svg"
                          }
                          alt={reply.authorDisplayName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {reply.authorDisplayName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.publishedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="mt-1">{reply.text}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <ThumbsUp className="mr-2 size-4" />
                            {reply.likeCount}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <ThumbsDown className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
