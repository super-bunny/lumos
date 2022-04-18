import Display from 'ddc-enhanced-rs'

export function mockDisplayLib() {
  Display.info = () => [
    {
      id: 5637997970,
      display_id: 'pojaojda79jononzdoz753poa',
      manufacturer_id: 'AOC_994368003',
      serial_number: '0589524898840054',
      model_name: 'AOC 25JTD',
    },
    {
      id: 98600229770079,
      display_id: 'xln95k68KNJYTdks25',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      id: 813300800873,
      display_id: 'opjaoinfoief8798peonnanda',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      id: 989051972131,
      display_id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      id: 97341900966898,
      display_id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      id: 88723538990,
      display_id: 'pqppo74dpadoa08dzaoidnia764598',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
  ]

  Display.prototype.set_brightness = () => undefined
  Display.prototype.get_brightness = () => {
    const maximum = Math.round(Math.random() * 1000)

    return {
      value: Math.round(Math.random() * maximum),
      maximum,
    }
  }
}
