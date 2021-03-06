import Link from 'next/link'
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps} from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import React from 'react';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];

}

export default function Home({ latesEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latesEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192}
                  height={192} 
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                  />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title} </a>
                  <p> {episode.members} </p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/assets/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" >
                        <img src="/assets/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
  params: { 
    _limit: 12,
    _sort: 'published_at',
    _order: 'desc'
  }
})


const episodes = data.map(epsode => {
  return { 
    id: epsode.id,
    title: epsode.title,
    thumbnail: epsode.thumbnail,
    members: epsode.members,
    published_At: format(parseISO(epsode.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(epsode.file.duration),
    durationAsString:convertDurationToTimeString(Number(epsode.file.duration)),
    description: epsode.description,
    url: epsode.file.url,
  };
})



const latesEpisodes = episodes.slice(0, 2);
const allEpisodes = episodes.slice(2, episodes.length);
//console.log(latesEpisodes);
  return {
    props: {
      latesEpisodes, 
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
};


