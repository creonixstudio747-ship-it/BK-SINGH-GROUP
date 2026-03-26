"use client";

import React, { useEffect, useState } from "react";
import { PlayCircle, Clock, X, Loader2 } from "lucide-react";

const YOUTUBE_API_KEY = "AIzaSyB06NFG9FtXNdtO_qOtR3AkGl24mj22cYQ";
const CHANNEL_ID = "UCQ9Mr2KzICkZzoc6r5R-h3w";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
}

const YouTubeFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`;
        const res = await fetch(searchUrl);
        const data = await res.json();

        if (data.items) {
          const videoIds = data.items.map((item: any) => item.id.videoId).join(",");
          const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();

          const formattedVideos = detailsData.items
            .filter((item: any) => {
                // Filter out shorts (duration < 60s)
                const duration = item.contentDetails.duration;
                const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                let seconds = 0;
                if (match) {
                    seconds = (parseInt(match[1]) || 0) * 3600 + (parseInt(match[2]) || 0) * 60 + (parseInt(match[3]) || 0);
                }
                return seconds > 60;
            })
            .slice(0, 4)
            .map((item: any) => ({
              id: item.id,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              publishedAt: item.snippet.publishedAt,
              duration: item.contentDetails.duration,
            }));

          setVideos(formattedVideos);
        }
      } catch (err) {
        console.error("YouTube fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <section className="youtube-feed container" id="youtubeSection">
      <div className="section-header">
        <h2 className="text-3xl font-bold">Latest Lectures & Vlogs</h2>
        <p className="text-zinc-400">Stay updated with our newest educational content and insights</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="animate-spin cyber-green" size={40} />
          <p className="text-zinc-500">Loading latest videos...</p>
        </div>
      ) : (
        <div className="grid-12 gap-6">
          {videos.map((video) => (
            <div 
                key={video.id} 
                className="col-span-12 md:col-span-3 glass-card interactive overflow-hidden group cursor-pointer"
                onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative aspect-video">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white" size={48} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm line-clamp-2 text-white group-hover:text-green-400 transition-colors">{video.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                  <Clock size={14} />
                  <span>{timeSince(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div className="yt-modal-overlay active" onClick={() => setSelectedVideo(null)}>
          <div className="yt-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="yt-close-btn" onClick={() => setSelectedVideo(null)}>
              <X size={24} />
            </button>
            <div className="yt-iframe-container">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default YouTubeFeed;
