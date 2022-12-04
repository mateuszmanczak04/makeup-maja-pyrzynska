export default async function scrollToId(id, router) {
  if (router.pathname !== '/') {
    await router.push('/');
    const el = document.getElementById(id);
    el.scrollIntoView();
    return;
  }

  const el = document.getElementById(id);
  el.scrollIntoView({ behavior: 'smooth' });
}
