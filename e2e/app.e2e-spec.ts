import { HomeroMovilPage } from './app.po';

describe('homero-movil App', () => {
  let page: HomeroMovilPage;

  beforeEach(() => {
    page = new HomeroMovilPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
