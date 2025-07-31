// Destination: src/components/ui/SubjectSelector.tsx
// Subject selector component with visual indicators

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Subject } from '../../types/lesson.types';

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: string;
  onSelectSubject: (subjectId: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  error,
  placeholder = 'Select Subject',
  disabled = false
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  const handleSubjectSelect = (subjectId: string) => {
    onSelectSubject(subjectId);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          {selectedSubjectData ? (
            <View style={styles.selectedSubject}>
              <Text style={styles.subjectIcon}>{selectedSubjectData.icon}</Text>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{selectedSubjectData.name}</Text>
                <Text style={styles.subjectDescription} numberOfLines={1}>
                  {selectedSubjectData.description}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.subjectList}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectOption,
                    selectedSubject === subject.id && styles.selectedOption
                  ]}
                  onPress={() => handleSubjectSelect(subject.id)}
                >
                  <View style={styles.subjectOptionContent}>
                    <Text style={styles.subjectIcon}>{subject.icon}</Text>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectDescription}>
                        {subject.description}
                      </Text>
                      <View style={styles.standardsContainer}>
                        {subject.standards.map((standard, index) => (
                          <Text key={index} style={styles.standard}>
                            {standard}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                  {selectedSubject === subject.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  selectorError: {
    borderColor: '#ff4444',
  },
  selectorDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subjectDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  subjectList: {
    padding: 16,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  subjectOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  standardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  standard: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#2196f3',
    fontWeight: 'bold',
  },
});

export default SubjectSelector;