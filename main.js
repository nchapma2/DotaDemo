$d(() => {
  let root = $d('dota');
  root.append($d("<select className='hero-select'></select"));

  let heroes;
  $d.ajax({
    url: "https://api.opendota.com/api/heroes"
  })
  .then(arr => heroes = arr);
  heroes.forEach(hero => {
    $('hero-select').append(`<option>${hero.localized_name}</option>`);
  });
});
