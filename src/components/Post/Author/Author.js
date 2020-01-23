// @flow strict
import React from 'react';
import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
      잘못된 내용이 있다면 Pull Request로 고쳐주시거나 혹은 Issue를 통해 제게 꼭 알려주세요! 댓글도 좋습니다.
        <a
          className={styles['author__bio-twitter']}
          href="https://github.com/HyunSangHan/TIL"
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>HyunSangHan > TIL</strong> on Github
        </a>
      </p>
    </div>
  );
};

export default Author;
