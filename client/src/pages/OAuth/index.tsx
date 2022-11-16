import cx from 'classnames';
import Loader from 'components/common/Loader';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postAuthLogin } from 'src/apis/auth';
import UserContext from 'src/contexts/user';

import style from './style.module.scss';

function OAuthPage() {
  const userContext = useContext(UserContext);

  if (userContext === null) {
    console.log('유저 컨텍스트를 찾을 수 없습니다.');

    return (
      <>
        <Loader size={100} />
      </>
    );
  }

  const location = useLocation();
  const navigate = useNavigate();

  const login = async (code: string) => {
    try {
      const authorizedUser = await postAuthLogin(code);

      userContext.setUser(authorizedUser);

      navigate('/workspace');
    } catch (e) {
      navigate('/');
    }
  };

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const code = search.get('code');

    if (!code) {
      navigate('/');
      return;
    }

    login(code);
  }, []);

  return (
    <div className={cx(style.container)}>
      <Loader size={100} />
    </div>
  );
}

export default OAuthPage;
