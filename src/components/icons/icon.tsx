import React, {ReactElement} from 'react';
import {
  IconAppStore,
  IconExternal,
  IconFolder,
  IconGitHub,
  IconLinkedin,
  IconLoader,
  IconLogo,
  IconPlayStore,
} from '../../components/icons';

interface NameProps {
  name: string
}

const Icon = ({name}: NameProps): ReactElement => {
  switch (name) {
    case 'AppStore':
      return <IconAppStore />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'PlayStore':
      return <IconPlayStore />;
    default:
      return <IconExternal />;
  }
};

export default Icon;
