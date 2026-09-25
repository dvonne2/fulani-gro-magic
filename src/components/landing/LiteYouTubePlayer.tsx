import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface LiteYouTubePlayerProps {
  id: string;
  title: string;
  thumbnail: string;
  webp?: boolean;
  lazyLoad?: boolean;
  params?: string;
}

export default function LiteYouTubePlayer({
  id,
  title,
  thumbnail,
  webp = true,
  lazyLoad = true,
  params = 'rel=0',
}: LiteYouTubePlayerProps) {
  return (
    <LiteYouTubeEmbed
      id={id}
      title={title}
      thumbnail={thumbnail}
      webp={webp}
      lazyLoad={lazyLoad}
      params={params}
    />
  );
}
