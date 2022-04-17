import Display from 'ddc-enhanced-rs'

export function mockDisplayLib() {
  Display.info = () => [
    {
      uuid: 'jpoj57k97xe9004dre996',
      id: 'jpoj57k97xe9004dre996',
      manufacturer_id: 'AOC_994368003',
      serial_number: '0589524898840054',
      model_name: 'AOC 25JTD',
    },
    {
      uuid: 'ltj64kdo9bck3324odk097',
      id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      uuid: 'ltj64kdo9bck3324odk097',
      id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      uuid: 'ltj64kdo9bck3324odk097',
      id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      uuid: 'ltj64kdo9bck3324odk097',
      id: 'ltj64kdo9bck3324odk097',
      manufacturer_id: 'ASUS_00556883357',
      serial_number: '0089481423986830651',
      model_name: 'ASUS JKUI87',
    },
    {
      uuid: 'ltj64kdo9bck3324odk097',
      id: 'ltj64kdo9bck3324odk097',
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
