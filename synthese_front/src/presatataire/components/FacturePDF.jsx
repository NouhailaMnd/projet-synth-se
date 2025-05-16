import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2b6cb0',
    paddingBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 20
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#2b6cb0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a4365',
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: 'bold',
    width: '40%'
  },
  value: {
    fontSize: 12,
    color: '#2D3748',
    width: '60%'
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2a4365'
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#718096',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 15,
    alignSelf: 'center'
  }
});

// Fonction pour formater les dates
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const FacturePDF = ({ abonnement, user }) => {
  const date = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec logo (remplacez par votre propre image si nécessaire) */}
        <View style={styles.header}>
          {/* Vous pouvez remplacer cette partie par votre propre logo */}
          <View style={styles.title}>
            <Text style={{ color: '#2b6cb0', fontWeight: 'bold', fontSize: 14 }}>Service à domocile</Text>
          </View>
          <Text style={styles.title}>FACTURE D'ABONNEMENT</Text>
          <Text style={styles.subtitle}> Émise le {date}</Text>
        </View>

        {/* Section Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Client</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom :</Text>
            <Text style={styles.value}>{user.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email :</Text>
            <Text style={styles.value}>{user.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Section Abonnement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de l'Abonnement</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Type :</Text>
            <Text style={styles.value}>{abonnement.type_abonnement.type || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Durée :</Text>
            <Text style={styles.value}>{abonnement.type_abonnement.duree_mois || 'N/A'} mois</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de début :</Text>
            <Text style={styles.value}>{formatDate(abonnement.date_debut)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de fin :</Text>
            <Text style={styles.value}>{formatDate(abonnement.date_fin)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Statut :</Text>
            <Text style={styles.value}>{abonnement.status || 'N/A'}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Montant Total :</Text>
          <Text style={styles.totalValue}>{abonnement.type_abonnement.prix || '0'} DH</Text>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Merci pour votre confiance !</Text>
          <Text>Pour toute question, contactez-nous à votreServise@àDomocile.com</Text>
          <Text>© {new Date().getFullYear()} Service à domocile - Tous droits réservés</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturePDF;