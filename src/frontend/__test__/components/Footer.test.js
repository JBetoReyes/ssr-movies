import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Footer from '../../components/Footer.jsx';

describe('<Footer />', () => {
  const wrapper = mount(<Footer />);
  test('Should render the Footer', () => {
    expect(wrapper.length).toBe(1);
  });
  test('Footer have 3 anchors', () => {
    expect(wrapper.find('a')).toHaveLength(3);
  });
  test('Should match snapshot', () => {
    const footerSnap = create(<Footer />);
    expect(footerSnap.toJSON()).toMatchSnapshot();
  });
});
