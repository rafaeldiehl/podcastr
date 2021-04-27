import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";

import { api } from "../../services/api";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { usePlayer } from "../../contexts/PlayerContext";

import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "../../styles/pages/episode.module.scss";

type Episode = {
  id: string;
  title: string;
  members: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  type: string;
  duration: number;
  durationAsString: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.flexContainer}>
          <div className={styles.thumbnailContainer}>
            <Link href="/">
              <button type="button">
                <img src="/arrow-left.svg" alt="Voltar" />
              </button>
            </Link>
            <img src={episode.thumbnail} alt={episode.description} />
            <button type="button">
              <img src="/play.svg" alt="Tocar episódio" />
            </button>
          </div>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <div className={styles.spanContainer}>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
          </div>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
