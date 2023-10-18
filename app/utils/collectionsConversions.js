export function extractProvidersAndServicesFromUserData(data) {
    const providers = data.map((item) => item.provider_id);
    const services = data.flatMap((item) => item.services);
  
    // Deduplicate the services array
    const uniqueServices = [...new Set(services)];
  
    return { providers, uniqueServices };
  }
  

export function spreadSheetDataToUserPricing(array) {
    const userPricing = [];
  
    const zones = array[0].slice(1); // Extract zones from the first row
    const additionalKgPrices = array[array.length - 1].slice(1); // Extract additional kg prices from the last row
  
    for (let i = 1; i < array.length - 1; i++) {
      const kg = i;
      const row = array[i];
      const prices = row.slice(1).map((cell, index) => ({
        zone: zones[index].value,
        price: parseFloat(cell.value.replace('$', '').replace(',', '.').trim()), // Parse the price value
      }));
  
      userPricing.push({
        kg,
        prices,
      });
    }
  
    // Add the additional KG prices
    userPricing.push({
      kg: 'extra',
      prices: additionalKgPrices.map((cell,index) => ({
        zone: zones[index].value,
        price: parseFloat(cell.value.replace('$', '').replace(',', '.').trim()), // Parse the price value
      })),
    });
  
    return userPricing;
  }
  
export function userPricingToSpreadsheet(userPricingData) {
    const firstRow = [{ value: " KG", readOnly: true }];
    const zones = [];
  
    // Extract zones from the user pricing data
    for (const entry of userPricingData) {
      for (const price of entry.prices) {
        if (!zones.includes(price.zone)) {
          zones.push(price.zone);
        }
      }
    }
  
    // Create the first row with zone names
    zones.forEach((zone) => {
      firstRow.push({ value: zone, readOnly: true });
    });
  
    // Create the rows for each kg entry and the last row for extra Kgs
    const rows = [firstRow];
    for (let i = 1; i <= 30; i++) {
      const row = [{ value: i, readOnly: true }];
      for (const zone of zones) {
        const price = userPricingData
          .find((entry) => entry.kg === i)
          .prices.find((p) => p.zone === zone);
        row.push({ value: ` $ ${price.price.toFixed(2)}` });
      }
      rows.push(row);
    }
  
    // Last row for extra Kgs
    const lastRow = [{ value: " Kg. Adic", readOnly: true }];
    for (const zone of zones) {
      const price = userPricingData[30].prices.find((p) => p.zone === zone);
      lastRow.push({ value: ` $ ${price.price.toFixed(2)}` });
    }
    rows.push(lastRow);
  
    return rows;
  }
  