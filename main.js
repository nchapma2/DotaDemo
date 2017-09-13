$d(() => {
  let root = $d('.dota');
  let select = $d('<select>');
  select.addClass('hero-select');


  let promise = $d.ajax({
    method: "GET",
    url: "https://api.opendota.com/api/heroStats"
  }).then(arr => {
    arr.forEach((el, i) => {
      let option = $d('<option>');
      option.addClass(`${el.id}`);
      option.attr('img', `http://cdn.dota2.com${el.img}`);
      let text = document.createTextNode(`${el.localized_name}`);
      option.elements[0].appendChild(text);
      select.append(option);
    });
    $d('.dota').append(select);
    select.attr('value', "");
    $d('.hero-select').on('change', e => {
      let opt = Array.from(e.currentTarget.children).filter(e => e.selected);
      $d('.hero-image').attr('src', $d(opt[0]).attr('img'));

      $d.ajax({
        url: "https://api.opendota.com/api/benchmarks",
        method:"GET",
        data: {hero_id: $d(opt[0]).attr('class') }
      }).then(obj => {
        let percentiles = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99];
        percentiles.forEach(el => {
          $d('.p' + `${el}`.split(".").join("")).empty();
          let td = $d('<td>');
          td.html(el);
          $d('.p' + `${el}`.split(".").join("")).append(td);
        });
        let result = obj.result;
        Object.keys(result).forEach((stat, i) => {
          result[stat].forEach(el => {
            let td = $d('<td>');
            td.html(`${el.value}`.slice(0,5));

            $d('.p' + `${el.percentile}`.split(".").join("")).append(td);

          });
        });

    });
  });


});
});
