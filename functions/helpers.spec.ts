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
      title: 'The Movie',
      name: 'The Movie',
      poster_path: '/poster.jpg',
      image: {
        url: 'https://image.tmdb.org/t/p/w200/poster.jpg'
      },
      externalUrl: 'https://example.com/1'
    });
  });
});
