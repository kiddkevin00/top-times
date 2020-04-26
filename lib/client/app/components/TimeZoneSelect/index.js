import SelectTimeZone from './SelectTimeZone';
import { generateUniqueId } from '../../utils/helpers';
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../../../static/assets/styles/components/timeZoneSelect.scss';

export default function TimeZoneSelect({ className, id, onChange, value }) {
  const clazzName = cx('time-zone-select', className);

  return (
    <SelectTimeZone
      className={clazzName}
      id={id || generateUniqueId()}
      onChange={onChange}
      value={value}
    />
  );
}

TimeZoneSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
};

TimeZoneSelect.defaultProps = {
  className: '',
  id: undefined,
  value: undefined,
};

export const { nullValueInTimeZoneSelect } = SelectTimeZone;
