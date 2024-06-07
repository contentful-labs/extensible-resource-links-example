import { transformResult } from './helpers';
import { TmdbItem } from './types/tmdb';

describe('Transforming the result', () => {
  it('transforms a movie result', () => {
    const result: TmdbItem = {
      id: 1,
      title: 'The Movie',
      poster_path: '/poster.jpg'
    };
    const transformed = transformResult('https://example.com')(result);
    expect(transformed).toEqual({
      id: '1',
      name: 'The Movie',
      image: {
        url: 'https://image.tmdb.org/t/p/w200/poster.jpg'
      },
      externalUrl: 'https://example.com/1'
    });
  });

  it('transforms a person result', () => {
    const result: TmdbItem = {
      id: 2,
      name: 'A Person',
      profile_path: '/profile.jpg'
    };
    const transformed = transformResult('https://example.com')(result);
    expect(transformed).toEqual({
      id: '2',
      name: 'A Person',
      image: {
        url: 'https://image.tmdb.org/t/p/w200/profile.jpg'
      },
      externalUrl: 'https://example.com/2'
    });
  });
});
