import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import app from '../db/dbConfig';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { retrieveUserInfo } from '../db/session';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const achievementsCriteria = [
  { threshold: 5, label: 'Complete 5 tasks' },
  { threshold: 10, label: 'Complete 10 tasks' },
  { threshold: 20, label: 'Complete 20 tasks' },
  { threshold: 50, label: 'Complete 50 tasks' },
  { threshold: 100, label: 'Complete 100 tasks' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  achievementTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementLabel: {
    fontSize: 16,
  },
  achievementStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#2196F3', 
    borderRadius: 20, 
    color: 'white', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 100, 
    textAlign: 'center', 
  },
  badgeIcon: {
    marginRight: 8, 
  },

  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  statusBox: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  completed: {
    backgroundColor: '#2196F3', 
  },
  uncompleted: {
    backgroundColor: 'grey',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold', 
    fontSize: 14, 
  },
});

export default function AchievementView() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedAchievement, setCompletedAchievement] = useState('');
  // 添加一个新的状态来跟踪已经弹窗过的成就
  const [triggeredAchievements, setTriggeredAchievements] = useState([]);

  useEffect(() => {
    let unsubscribe;
    
    const initFetchTotalTasks = async () => {
      const phoneNumber = await retrieveUserInfo('phone');
      if (!phoneNumber) {
        console.error('User phone number not found');
        return;
      }

      const db = getDatabase(app);
      const userRef = ref(db, `users/${phoneNumber}`);
      unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const totalTaskValue = userData.totalTask || 0;
          setTotalTasks(totalTaskValue);

          // 更新成就列表
          const updatedAchievements = achievementsCriteria.map(ac => ({
            ...ac,
            achieved: totalTaskValue >= ac.threshold
          }));
          setAchievements(updatedAchievements);

          // 检查新成就
          updatedAchievements.forEach(ac => {
            if (totalTaskValue >= ac.threshold && !triggeredAchievements.includes(ac.label)) {
              setCompletedAchievement(ac.label);
              setModalVisible(true);
              // 更新已触发弹窗的成就列表
              setTriggeredAchievements(prev => [...prev, ac.label]);
            }
          });
        } else {
          console.log('No user data available');
        }
      });
    };

    initFetchTotalTasks();

    // 清理函数
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);


  const renderAchievement = ({ item }) => (
  <View style={styles.achievementItem}>
    <View style={styles.achievementTextContainer}>
      {/* 徽章图标 */}
      <Icon name="trophy" color="#FFD700" size={24} style={styles.badgeIcon} />
      {/* 成就文本 */}
      <Text style={styles.achievementLabel}>{item.label}</Text>
    </View>
    {/* 成就状态 */}
    <Text style={[styles.achievementStatus, item.achieved ? styles.completed : styles.uncompleted]}>
      {item.achieved ? 'Completed' : 'Uncompleted'}
    </Text>
  </View>
);
  
  

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Congratulations!</Text>
            
            <Icon2
              name="military-tech"
              size={50} 
              color="#DAA520" 
            />
            
            <Text style={styles.modalText}>
              You have completed:{'\n'}{completedAchievement}
            </Text>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Your Total Achievements: {totalTasks}</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item, index) => `achievement-${index}`}
      />
    </View>
  );
}
