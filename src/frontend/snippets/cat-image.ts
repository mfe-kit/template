import { namespace } from '../config';

export const CatImage = (imgUrl: string, isLoading: boolean): string => {
  return `
    <div class="${namespace}-img ${isLoading ? namespace + '-hide' : ''}">
      <img class="${namespace}-image" src="${imgUrl}" alt="cat" />
    </div>
  `;
};
