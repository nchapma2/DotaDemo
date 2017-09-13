$d(() => {
  let root = $d('.dota');
  let select = $d('<select>');
  select.addClass('hero-select');
  // root.append(select);

  let promise = $d.ajax({
    method: "GET",
    url: "https://api.opendota.com/api/heroes"
  }).then(arr => {
    arr.forEach((el, i) => {
      let option = $d('<option>');
      option.addClass(`${el.id}`);
      option.attr('value', `${el.id}`);
      let text = document.createTextNode(`${el.localized_name}`);
      option.elements[0].appendChild(text);
      select.append(option);
    });
    $d('.dota').append(select);
  });
});
