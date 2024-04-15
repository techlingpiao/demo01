# 参考文档

## UI库

[https://reactnativeelements.com/docs/components](https://reactnativeelements.com/docs/components)

## 数据库操作

[https://firebase.google.com/docs/database/web/read-and-write](https://firebase.google.com/docs/database/web/read-and-write)

## react-native Navigation
[https://reactnavigation.org/](https://reactnavigation.org/)

跳转： navigation.navigate("xxx") //xxx为路径名，即Stack.Screen中的name

跳回： navigation.goBack() //将返回上个界面

# 关于数据库连接

```javascript
import { get, getDatabase, ref } from "firebase/database";
import app from "../db/dbConfig";

const db = getDatabase(app);
//获取数据
const fetchData = async () => {
	const taskCountRef = ref(db, 'tasks/' + props.taskid); //第二个参数为路径名，如'user/'+phone，等
    const taskSnapshot = await get(taskCountRef);  //获取snapshot
	setTitle(taskSnapshot.val().title); // snapshot.val()为值，snapshot.key为键
    //如结构为{user: {name："xxx"}，要取得xxx, 可以使用
    //const name = await get(ref(db, 'users/user/name')).val()
    //或 const name = await get(ref(db,'users/user')).val().name 其实.val()取到的是一个对象
};

//更新数据（写入数据）
const updateData = async () => {
	const taskCountRef = ref(db, 'tasks/' + props.taskid); //第二个参数为路径名，如'user/'+phone，等
    await update(taskCountRef, {name: xxx, age:20}) //已存在的键值对更新，不存在的键值对添加
};
```

