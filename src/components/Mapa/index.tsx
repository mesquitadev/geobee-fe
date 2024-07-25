import 'leaflet/dist/leaflet.css'
import omnivore from 'leaflet-omnivore'
import kml from './geobee-2023.kml'
import * as turf from '@turf/turf'
import L from 'leaflet'

import { useEffect, useRef } from 'react'
import { calcularRaioVoo, exibirPorTipo, getColor } from '../../utils'

const calcularCapacidadeSuporteApicultura = (areaTotal: number) => {
  const capacidadeSuporte = areaTotal / 7.07
  return Math.round(capacidadeSuporte)
}

function calcularCapacidadeSuporteMeliponicultura(hectares: number) {
  const arvoresPorHectare = 570
  const quantidadeArvores = hectares * arvoresPorHectare
  const arvoresPasto = quantidadeArvores * 0.45 // 45% das árvores fazem parte do pasto das abelhas
  const colmeiasPorHectare = arvoresPasto / 100 // Cada colmeia precisa de 100 árvores
  return Math.round(colmeiasPorHectare)
}

async function processGeoJSON(
  geojsonUrl,
  latitude,
  longitude,
  businessData,
  userData,
) {
  try {
    const response = await fetch(geojsonUrl)
    const geojsonData = await response.json()

    const centro = turf.point([Number(longitude), Number(latitude)])
    const { raioVooDEC } = calcularRaioVoo({
      tipoCadastro: businessData.role,
    })
    const buffer = turf.buffer(centro, raioVooDEC, { units: 'kilometers' })

    const layers = geojsonData.features

    // Verifica camadas do buffer
    const featuresDentroBuffer = layers.filter((layer) => {
      return turf.booleanIntersects(layer, buffer)
    })

    const areas = {}
    featuresDentroBuffer.forEach((layer) => {
      const nomeCamada = layer.properties.VEGETACAO
      const area = parseFloat(layer.properties['AREA (Ha)'])
      if (!areas[nomeCamada]) {
        areas[nomeCamada] = 0
      }
      areas[nomeCamada] += area
    })

    const areaTotal =
      (areas.URBANO || 0) + (areas.ARBUSTIVO || 0) + (areas.HERBACEO || 0)
    const suporteApicultura = calcularCapacidadeSuporteApicultura(areaTotal)
    const pasto = calcularCapacidadeSuporteMeliponicultura(
      Number(areas.ARBOREO),
    )

    if (userData.role === 'APICULTOR') {
      return suporteApicultura
    } else if (userData.role === 'MELIPONICULTOR') {
      return pasto
    }
  } catch (error) {
    console.error('Erro ao processar GeoJSON:', error)
  }
}

const Mapa = ({ userData, businessData, loading }) => {
  const mapContainer = useRef()
  const { latitude, longitude } = businessData[0]
  useEffect(() => {
    if (!loading) {
      const lat = Number(latitude)
      const lng = Number(longitude)
      const map = L.map(mapContainer.current).setView(
        [-2.5555334824608353, -44.208297729492195],
        12,
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const centro = turf.point([lat, lng])

      const { raioVooKM, raioVooDEC } = calcularRaioVoo({
        tipoCadastro: businessData.role,
      })
      const buffer = turf.buffer(centro, raioVooDEC, { units: 'kilometers' })

      // Empreendimento
      const marker = L.marker([lat, lng]).addTo(map)
      L.circle(marker.getLatLng(), { radius: raioVooKM }).addTo(map)
      omnivore
        .kml(kml)
        .addTo(map)
        .on('ready', function () {
          const kmlLayer = this
          const layers = this.getLayers()

          // Seta cores do mapa
          layers.forEach((layer) => {
            if (layer.feature.properties) {
              const cor = getColor(layer.feature.properties.VEGETAÇÃ)
              layer.setStyle({
                fillColor: cor,
                color: cor,
              })
            }
          })

          //   Verifica camadas do buffer
          const featuresDentroBuffer = kmlLayer.getLayers().filter((layer) => {
            const layerGeoJSON = layer.toGeoJSON()
            return turf.booleanIntersects(layerGeoJSON, buffer)
          })

          const areas = {}
          featuresDentroBuffer.forEach((layer) => {
            const nomeCamada = layer.feature.properties.VEGETAÇÃ
            const area = parseFloat(layer.feature.properties['AREA (Ha)'])

            if (!areas[nomeCamada]) {
              areas[nomeCamada] = 0
            }
            areas[nomeCamada] += area
          })

          const areaTotal =
            (areas.URBANO || 0) + (areas.ARBUSTIVO || 0) + (areas.HERBACEO || 0)

          const suporteApicultura =
            calcularCapacidadeSuporteApicultura(areaTotal)
          const pasto = calcularCapacidadeSuporteMeliponicultura(
            Number(areas.ARBOREO),
          )

          if (userData.role === 'APICULTOR') {
            exibirPorTipo('apicultor', marker, suporteApicultura)
          } else if (userData.role === 'MELIPONICULTOR') {
            exibirPorTipo('meliponicultor', marker, pasto)
          }
        })

      return () => {
        map.remove()
      }
    }
  }, [
    businessData.role,
    latitude,
    loading,
    longitude,
    userData,
    userData.businessType,
    userData.latitude,
    userData.longitude,
  ])

  useEffect(() => {
    const kmls = processGeoJSON(
      'https://raw.githubusercontent.com/mesquitadev/geobee-fe/main/src/components/Mapa/geobee.geojson',
      latitude,
      longitude,
      businessData,
      userData,
    )
    console.log('kml', kmls)
  }, [businessData, latitude, longitude, userData])

  return <div className="w-full h-full" ref={mapContainer} />
}

export default Mapa
