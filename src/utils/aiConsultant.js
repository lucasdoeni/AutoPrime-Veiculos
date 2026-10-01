import { formatBRL, formatKm, generateWhatsAppLink } from './formatters.js';
import { dealershipInfo } from '../data/vehiclesData.js';

/**
 * Intelligent parser that extracts automotive intent, budgets, categories, and tags
 * from user natural language and matches against live vehicle inventory.
 */
export function analyzeUserQuery(query, vehicles = []) {
  const q = query.toLowerCase().trim();

  // 1. Price Budget Extraction
  let maxPrice = null;
  let minPrice = null;

  // Patterns like "ate 500 mil", "ate 500k", "ate R$ 500.000", "menos de 600 mil"
  const upToRegex = /(?:até|ate|menos de|máximo de|maximo de|na faixa de|por volta de)\s*(?:r\$\s*)?(\d+)(?:\s*(?:mil|k))?/i;
  const upToMatch = q.match(upToRegex);
  if (upToMatch) {
    let num = parseInt(upToMatch[1], 10);
    if (num < 1000) num = num * 1000;
    maxPrice = num;
  }

  // Direct number search like "500 mil" or "500000"
  if (!maxPrice) {
    const directMil = q.match(/(\d+)\s*(?:mil|k)/i);
    if (directMil) {
      maxPrice = parseInt(directMil[1], 10) * 1000;
    }
  }

  // 2. Category intent
  let targetCategory = null;
  if (q.includes('suv') || q.includes('utilitario') || q.includes('utilitário') || q.includes('camionete')) {
    targetCategory = 'SUV';
  } else if (q.includes('seda') || q.includes('sedã') || q.includes('sedan') || q.includes('executivo')) {
    targetCategory = 'Sedã';
  } else if (q.includes('esportivo') || q.includes('coupe') || q.includes('cupê') || q.includes('pista') || q.includes('conversivel')) {
    targetCategory = 'Esportivo';
  } else if (q.includes('picape') || q.includes('pickup') || q.includes('cacamba') || q.includes('caçamba')) {
    targetCategory = 'Picape';
  }

  // 3. Armor / Blindagem
  const wantsArmored = q.includes('blindado') || q.includes('blindagem') || q.includes('segurança armada') || q.includes('protegido');

  // 4. Family / Space
  const wantsFamily = q.includes('familia') || q.includes('família') || q.includes('filhos') || q.includes('viajar') || q.includes('viagem') || q.includes('7 lugares') || q.includes('espacoso') || q.includes('espaçoso') || q.includes('confortavel');

  // 5. Fuel & Efficiency
  const wantsHybridOrElectric = q.includes('hibrid') || q.includes('híbrid') || q.includes('eletric') || q.includes('elétric') || q.includes('plug-in') || q.includes('sustentav');
  const wantsEconomical = q.includes('economico') || q.includes('econômico') || q.includes('consumo');
  const wantsDiesel = q.includes('diesel') || q.includes('turbodiesel');

  // 6. Performance / Speed
  const wantsPower = q.includes('potente') || q.includes('rapido') || q.includes('rápido') || q.includes('v8') || q.includes('cavalos') || q.includes('aceleracao') || q.includes('aceleração') || q.includes('veloz') || q.includes('desempenho');

  // 7. Brands
  const detectedBrand = ['porsche', 'bmw', 'mercedes', 'audi', 'land rover', 'ford', 'volvo', 'toyota', 'ram', 'jeep']
    .find(b => q.includes(b));

  // Score and filter vehicles
  const scoredVehicles = vehicles.map(car => {
    let score = 0;
    const carText = `${car.brand} ${car.model} ${car.version} ${car.category} ${car.description} ${car.features?.join(' ')} ${car.badges?.join(' ')} ${car.engine}`.toLowerCase();

    // Brand exact match (+40)
    if (detectedBrand && carText.includes(detectedBrand)) {
      score += 40;
    }

    // Category match (+30)
    if (targetCategory && car.category.toLowerCase() === targetCategory.toLowerCase()) {
      score += 30;
    }

    // Blindagem match (+45)
    if (wantsArmored) {
      if (carText.includes('blindad')) score += 45;
      else score -= 20;
    }

    // Family match: favor SUVs, 7-lugares, sedãs grandes (+25)
    if (wantsFamily) {
      if (car.category === 'SUV') score += 20;
      if (carText.includes('7 lugares') || carText.includes('espaco') || carText.includes('espaço')) score += 25;
    }

    // Hybrid/Electric match (+35)
    if (wantsHybridOrElectric) {
      if (car.fuel?.toLowerCase().includes('híbrid') || car.fuel?.toLowerCase().includes('elétr') || carText.includes('plug-in')) {
        score += 35;
      } else {
        score -= 15;
      }
    }

    // Economical match (+20)
    if (wantsEconomical) {
      if (car.fuel?.toLowerCase().includes('híbrid') || car.fuel?.toLowerCase().includes('diesel')) {
        score += 25;
      }
    }

    // Diesel match (+30)
    if (wantsDiesel) {
      if (car.fuel?.toLowerCase().includes('diesel')) score += 35;
    }

    // Power / V8 / Sports match (+25)
    if (wantsPower) {
      if (carText.includes('v8') || carText.includes('turbo') || carText.includes('cv') || car.category === 'Esportivo') {
        score += 25;
      }
    }

    // Price filtering
    if (maxPrice) {
      if (car.price <= maxPrice) {
        score += 20;
      } else if (car.price <= maxPrice * 1.15) {
        // slightly above budget, still can recommend (+5)
        score += 5;
      } else {
        score -= 50; // out of budget
      }
    }

    // Keyword matching in model/name
    const words = q.split(/\s+/).filter(w => w.length > 3);
    words.forEach(w => {
      if (carText.includes(w)) score += 8;
    });

    return { vehicle: car, score };
  });

  // Sort by score
  scoredVehicles.sort((a, b) => b.score - a.score);

  // Take top matching vehicles with positive score
  const bestMatches = scoredVehicles
    .filter(item => item.score > 0)
    .slice(0, 3)
    .map(item => item.vehicle);

  // If no strong matches, return top featured cars
  const finalMatches = bestMatches.length > 0 
    ? bestMatches 
    : vehicles.filter(v => v.featured).slice(0, 2);

  return {
    matches: finalMatches,
    detectedBrand,
    targetCategory,
    maxPrice,
    wantsArmored,
    wantsFamily,
    wantsHybridOrElectric,
    wantsPower
  };
}

/**
 * Generate a personalized, sophisticated sales advisor response in Portuguese.
 */
export function generateAdvisorResponse(query, analysis, availableVehicles = []) {
  const { matches, maxPrice, targetCategory, wantsArmored, wantsFamily, wantsHybridOrElectric, wantsPower } = analysis;

  if (matches.length === 0) {
    return {
      text: "Compreendo perfeitamente o seu interesse. No momento, nosso estoque de altíssimo padrão está passando por atualizações frequentes. Convido você a falar diretamente com um de nossos consultores executivos para buscarmos essa configuração sob encomenda na nossa rede de captação VIP.",
      vehicles: []
    };
  }

  let intro = "Excelente escolha de perfil! ";
  if (wantsArmored) {
    intro += "Para quem prioriza máxima segurança e discrição blindada, separei nossas opções com laudo cautelar aprovado e vidros intactos:";
  } else if (wantsFamily) {
    intro += "Pensando em conforto supremo, segurança máxima e espaço generoso para toda a família em viagens e no dia a dia, recomendo fortemente:";
  } else if (wantsHybridOrElectric) {
    intro += "Unindo tecnologia de ponta, sustentabilidade e torque imediato com economia expressiva, estas são as melhores opções eletrificadas do nosso acervo:";
  } else if (wantsPower) {
    intro += "Para entusiastas de aceleração vigorosa, som marcante de motorização esportiva e dirigibilidade pura:";
  } else if (targetCategory) {
    intro += `Encontrei exatamente o que você procura na categoria de ${targetCategory}s premium:`;
  } else if (maxPrice) {
    intro += `Dentro do seu planejamento financeiro de até ${formatBRL(maxPrice)}, temos opções espetaculares com procedência atestada:`;
  } else {
    intro += "Com base nas suas preferências, selecionei estas unidades impecáveis disponíveis no showroom da AutoPrime:";
  }

  // Build specific sales highlight
  const highlights = matches.map(car => {
    return `• **${car.brand} ${car.model} (${car.year})**: ${car.engine} — anunciado por ${formatBRL(car.price)} (${formatKm(car.mileage)} rodados).`;
  }).join('\n');

  const conclusion = "\n\nVocê pode clicar em **Ver Detalhes** para conferir a ficha técnica completa ou iniciar uma conversa direta no **WhatsApp** com o consultor responsável para negociar condições de pagamento ou agendar um test-drive exclusivo.";

  return {
    text: `${intro}\n\n${highlights}${conclusion}`,
    vehicles: matches
  };
}
