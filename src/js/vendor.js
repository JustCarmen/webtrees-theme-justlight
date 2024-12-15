// Just import the subset of icons that we use in resources/views/icons/
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  // For resources/views/icons/*
  faCalendarDays, faUserCircle
} from '@fortawesome/free-regular-svg-icons';
import {
  // For resources/views/icons/ (faTimes solid version is in webtrees core)*
  faSquarePlus, faBell, faUser
} from '@fortawesome/free-solid-svg-icons';

library.add(
  // For resources/views/icons/*
  faCalendarDays, faUserCircle
);
library.add(
  // For resources/views/icons/*
  faSquarePlus, faBell, faUser
);
dom.watch();
