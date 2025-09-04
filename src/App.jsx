import { createContext, useContext, useState, React, useEffect, useRef, useCallback } from 'react';
import { Breadcrumb, Layout, Menu, theme, Tree } from 'antd';
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    EyeOutlined,
    SmileOutlined,
    EyeInvisibleOutlined,
    DownOutlined,
    RightOutlined,
    PlusOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    BgColorsOutlined,
    MoonFilled,
    SunFilled,
    FolderOpenOutlined,
    BugOutlined,
    DownloadOutlined,
    UploadOutlined
} from '@ant-design/icons';
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import {
    Button,
    Flex,
    Col,
    Row,
    Card,
    Divider,
    Collapse,
    Typography,
    Dropdown,
    Modal,
    Form,
    Input,
    Space,
    ConfigProvider,
    Switch,
    Segmented,
    Upload
} from "antd";

const { Header, Content, Footer } = Layout;
let tree2 = [
    {
        "nodeID": "Node A",
        "nodeName": "Node A",
        "nodeDescription": "# Hi, *Pluto*!",
        "nodeColor": "Default",
        "edgeName": "some edge name",
        "showDescription": false,
        "showChildren": true,
        "children": [
            {
                "nodeID": "Node C",
                "nodeName": "Node C",
                "nodeDescription": `($\\frac{1}{2}$)`,
                "nodeColor": "Default",
                "edgeName": "",
                "showDescription": false,
                "showChildren": false,
                "children": []
            },
            {
                "nodeID": "Node B",
                "nodeName": "Node B",
                // "nodeName": "Node B Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam voluptate id minus optio, assumenda delectus debitis nesciunt ratione quaerat cum esse porro, accusantium voluptatum temporibus dicta dolor aliquam molestiae adipisci?",
                "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur abLorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur abLorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur abLorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam nam kha pariatur ab",
                "nodeColor": "Default",
                "edgeName": "",
                "showDescription": true,
                "showChildren": false,
                "children": [
                    {
                        "nodeID": "Node E",
                        "nodeName": "Node E",
                        // "nodeName": "Node E Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam voluptate id minus optio, assumenda delectus debitis nesciunt ratione quaerat cum esse porro, accusantium voluptatum temporibus dicta dolor aliquam molestiae adipisci?",
                        "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                        "nodeColor": "Default",
                        "edgeName": "",
                        "showDescription": true,
                        "showChildren": true,
                        "children": [
                        ],
                    },
                    {
                        "nodeID": "Node G",
                        "nodeName": "Node G",
                        // "nodeName": "Node E Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam voluptate id minus optio, assumenda delectus debitis nesciunt ratione quaerat cum esse porro, accusantium voluptatum temporibus dicta dolor aliquam molestiae adipisci?",
                        "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                        "nodeColor": "Default",
                        "edgeName": "",
                        "showDescription": false,
                        "showChildren": true,
                        "children": [
                            {
                                "nodeID": "Node I",
                                "nodeName": "Node I",
                                "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                                "nodeColor": "Default",
                                "edgeName": "",
                                "showDescription": true,
                                "showChildren": false,
                                "children": [
                                    {
                                        "nodeID": "Node K",
                                        "nodeName": "Node K",
                                        "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                                        "nodeColor": "Default",
                                        "edgeName": "",
                                        "showDescription": true,
                                        "showChildren": false,
                                        "children": [
                                        ]
                                    },
                                    {
                                        "nodeID": "Node L",
                                        "nodeName": "Node L",
                                        "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                                        "nodeColor": "Default",
                                        "edgeName": "",
                                        "showDescription": true,
                                        "showChildren": false,
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "nodeID": "Node J",
                                "nodeName": "Node J",
                                "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                                "nodeColor": "Default",
                                "edgeName": "",
                                "showDescription": true,
                                "showChildren": false,
                                "children": [
                                ]
                            }
                        ]
                    }, {
                        "nodeID": "Node H",
                        "nodeName": "Node H",
                        // "nodeName": "Node E Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam voluptate id minus optio, assumenda delectus debitis nesciunt ratione quaerat cum esse porro, accusantium voluptatum temporibus dicta dolor aliquam molestiae adipisci?",
                        "nodeDescription": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus deleniti in eum asperiores aliquid laboriosam fuga ullam reprehenderit suscipit. Nulla ullam repellat ipsum vitae nesciunt magni molestiae totam pariatur ab!",
                        "nodeColor": "Default",
                        "edgeName": "",
                        "showDescription": true,
                        "showChildren": false,
                        "children": [

                        ]
                    },
                    {
                        "nodeID": "Node D",
                        "nodeName": "Node D",
                        "nodeDescription": "",
                        "nodeColor": "Default",
                        "edgeName": "",
                        "showDescription": true,
                        "showChildren": true,
                        "children": [
                            {
                                "nodeID": "Node F",
                                "nodeName": "Node F",
                                "nodeDescription": "Lorem ipsum dolor",
                                "nodeColor": "Default",
                                "edgeName": "",
                                "showDescription": false,
                                "showChildren": false,
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "nodeID": "Node M",
                "nodeName": "Node M",
                "nodeDescription": `($\\frac{1}{2}$)`,
                "nodeColor": "Default",
                "edgeName": "",
                "showDescription": false,
                "showChildren": false,
                "children": []
            },
            {
                "nodeID": "Node N",
                "nodeName": "Node N",
                "nodeDescription": `($\\frac{1}{2}$)`,
                "nodeColor": "Default",
                "edgeName": "",
                "showDescription": false,
                "showChildren": false,
                "children": []
            },
        ]
    }
]


const CurrentTreeContext = createContext(null);

let radiusAmount = 12
let cardWidth = 200
let marginValue = 12

function moveNodeBeforeSibling(tree, id1, id2) {
    // Helper: deep clone to ensure immutability
    const clone = (obj) => JSON.parse(JSON.stringify(obj));

    const clonedTree = clone(tree);

    // Helper: find and remove a node by ID, returning [removedNode, newTree]
    function removeNode(node, targetId) {
        if (!node.children) return [null, node];

        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].nodeID === targetId) {
                const removed = node.children[i];
                return [removed, {
                    ...node,
                    children: [
                        ...node.children.slice(0, i),
                        ...node.children.slice(i + 1)
                    ]
                }];
            }
        }

        // Recursive search
        let newChildren = [];
        let removedNode = null;
        for (let child of node.children) {
            const [removed, updatedChild] = removeNode(child, targetId);
            if (removed) removedNode = removed;
            newChildren.push(updatedChild);
        }
        return [removedNode, { ...node, children: newChildren }];
    }

    // Helper: insert node before sibling
    function insertBefore(node, insertNode, targetId) {
        if (!node.children) return node;

        const idx = node.children.findIndex(c => c.nodeID === targetId);
        if (idx !== -1) {
            return {
                ...node,
                children: [
                    ...node.children.slice(0, idx),
                    insertNode,
                    ...node.children.slice(idx)
                ]
            };
        }

        return {
            ...node,
            children: node.children.map(c => insertBefore(c, insertNode, targetId))
        };
    }

    // Step 1: Remove id1 from tree
    const [removedNode, treeWithoutId1] = removeNode(clonedTree, id1);
    if (!removedNode) throw new Error(`Node ${id1} not found`);

    // Step 2: Insert removedNode before id2
    const newTree = insertBefore(treeWithoutId1, removedNode, id2);
    return newTree;
}


function recursiveModify(currNode, idToModify, attrModify, contentToModify) {
    if (currNode.nodeID == idToModify) {
        currNode[attrModify] = contentToModify != null ? contentToModify : !currNode[attrModify]
        return true
    }
    else {
        for (let childNode of currNode.children) {
            let found = recursiveModify(childNode, idToModify, attrModify, contentToModify != null ? contentToModify : null)
            if (found) {
                return true
            }
        }
    }
}
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234569';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function toggleShowDescription(node, currentTree, setCurrentTree) {
    let cloneTree = JSON.parse(JSON.stringify(currentTree))
    for (let rootNode of cloneTree) {
        let result = recursiveModify(rootNode, node.nodeID, "showDescription", null)
        if (result == true) {
            break
        }
    }
    setCurrentTree(cloneTree)
}
function toggleShowChildren(node, currentTree, setCurrentTree) {
    let cloneTree = JSON.parse(JSON.stringify(currentTree))
    for (let rootNode of cloneTree) {
        let result = recursiveModify(rootNode, node.nodeID, "showChildren", null)
        if (result == true) {
            break
        }
    }
    setCurrentTree(cloneTree)
}

function findAndPopNode(currNode, idToFind) {
    const index = currNode.children.findIndex(obj => obj.nodeID === idToFind);
    if (index !== -1) {
        return currNode.children.splice(index, 1)[0]; // removes and returns the object
    }
    else {
        for (let childNode of currNode.children) {
            let result = findAndPopNode(childNode, idToFind)
            if (result != null) {
                return result
            }
        }
    }
}

function findAndMoveNode(currNode, nodeToMove, idToFind) {
    const index = currNode.children.findIndex(obj => obj.nodeID === idToFind);
    console.log("index in find", index)
    console.log("currNode in find", currNode)
    if (index !== -1) {
        currNode.children.splice(index, 0, nodeToMove)
        console.log("currNode found", currNode)
        return true
    }
    else {
        for (let childNode of currNode.children) {
            let result = findAndMoveNode(childNode, nodeToMove, idToFind)
            if (result != null) {
                return result
            }
        }
    }
}

function handleMoveNode(id1, id2, currentTree, setCurrentTree) {
    let cloneTree = JSON.parse(JSON.stringify(currentTree))
    let nodeToMove = null
    for (let rootNode of cloneTree) {
        nodeToMove = findAndPopNode(rootNode, id1)
        if (nodeToMove != null) {
            break
        }
    }
    console.log("nodeToMove", nodeToMove)
    const index = cloneTree.findIndex(obj => obj.nodeID === id2);
    console.log("temp index", index)
    if (index !== -1) {
        cloneTree.splice(index, 0, nodeToMove)
    }
    else {
        for (let childNode of cloneTree) {
            let result = findAndMoveNode(childNode, nodeToMove, id2)
            if (result == true) {
                break
            }
        }
    }
    setCurrentTree(cloneTree)
}
function newNodeTemplate() {
    return {
        "nodeID": generateRandomString(10),
        "nodeName": "New Node",
        "nodeDescription": "",
        "edgeName": "",
        "nodeColor": "Default",
        "showDescription": false,
        "showChildren": true,
        "children": []
    }
}


const LeftLine = ({ node, nodeType }) => {
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    const { currentTree, setCurrentTree } = useContext(CurrentTreeContext);
    return (
        <>
            <Flex className='LeftLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                <div onClick={() => { toggleShowDescription(node, currentTree, setCurrentTree) }} style={{
                    caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                    borderBottom: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                    borderLeft: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                    borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                }}>

                </div>
                <div onClick={() => { toggleShowChildren(node, currentTree, setCurrentTree) }} style={{
                    caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                    borderTop: (nodeType == "top" || nodeType == "mid") ? `1px solid ${lineColor}` : "",
                    borderLeft: nodeType == "top" ? `1px solid ${lineColor}` : "",
                    borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                }}>
                </div>
            </Flex>
        </>
    )
}

const NodeCard = ({ node }) => {
    let antdTheme = theme.useToken()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentTree, setCurrentTree } = useContext(CurrentTreeContext);
    let [showDescriptionForm, setShowDescriptionForm] = useState(false)
    let [showNodeNameForm, setShowNodeNameForm] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    };
    const items = [
        {
            key: '1',
            label: (
                <Typography.Text>
                    Add
                </Typography.Text>
            ),
            icon: <PlusOutlined />,
            onClick: addChild
        },
        {
            key: '2',
            label: 'Color',
            icon: <BgColorsOutlined />,
            children: [
                {
                    key: 'Default',
                    label: <>
                        <div style={{ backgroundColor: antdTheme.token.colorFill, borderRadius: radiusAmount, height: 22, width: 48 }}></div>
                        {/* <Typography.Text style={{ color: antdTheme.token.colorErrorTextHover }}>Red</Typography.Text> */}
                    </>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Error',
                    label: <>
                        <div style={{ backgroundColor: antdTheme.token.colorErrorHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>
                        {/* <Typography.Text style={{ color: antdTheme.token.colorErrorTextHover }}>Red</Typography.Text> */}
                    </>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Info',
                    label: <>
                        <div style={{ backgroundColor: antdTheme.token.colorInfoHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>
                        {/* <Typography.Text style={{ color: antdTheme.token.colorInfoTextHover }}>Blue</Typography.Text> */}
                    </>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Success',
                    label: <>
                        <div style={{ backgroundColor: antdTheme.token.colorSuccessHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>
                        {/* <Typography.Text style={{ color: antdTheme.token.colorSuccessTextHover }}>Green</Typography.Text> */}
                    </>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Warning',
                    label: <>
                        <div style={{ backgroundColor: antdTheme.token.colorWarningHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>
                        {/* <Typography.Text style={{ color: antdTheme.token.colorWarningTextHover }}>Yellow</Typography.Text> */}
                    </>,
                    onClick: handleReColorNode
                },
            ],
        },
        {
            key: '3',
            danger: true,
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: showModal
        },
    ];
    function handleRenameNode(query) {
        const newName = query[`nodeName ${node.nodeID}`]
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveModify(rootNode, node.nodeID, "nodeName", newName)
            if (result == true) {
                break
            }
        }
        setShowNodeNameForm(false)
        setCurrentTree(cloneTree)
    }
    function handleRewriteDescription(query) {
        const newDes = query[`nodeDescription ${node.nodeID}`];
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveModify(rootNode, node.nodeID, "nodeDescription", newDes)
            if (result == true) {
                break
            }
        }
        setShowDescriptionForm(false)
        setCurrentTree(cloneTree)
    }
    function recursiveAddChild(currNode, idToModify) {
        if (currNode.nodeID == idToModify) {
            let newNode = newNodeTemplate()
            currNode.children.push(newNode)
            currNode.showChildren = true
            return true
        }
        else {
            for (let childNode of currNode.children) {
                let found = recursiveAddChild(childNode, idToModify)
                if (found) {
                    return true
                }
            }
        }
    }
    function recursiveDeleteNode(currNode, idToDelete) {
        const index = currNode.children.findIndex(item => item.nodeID === idToDelete);
        if (index !== -1) {
            currNode.children.splice(index, 1);
            return true
        }
        else {
            for (let childNode of currNode.children) {
                let found = recursiveDeleteNode(childNode, idToDelete)
                if (found) {
                    return true
                }
            }
        }
    }
    function addChild() {
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveAddChild(rootNode, node.nodeID)
            if (result == true) {
                break
            }
        }
        setCurrentTree(cloneTree)
    }
    function handleDeleteNode() {
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveDeleteNode(rootNode, node.nodeID)
            if (result == true) {
                break
            }
        }
        setIsModalOpen(false)
        setCurrentTree(cloneTree)
    }
    function handleReColorNode(e) {
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveModify(rootNode, node.nodeID, "nodeColor", `${e.key}`)
            if (result == true) {
                break
            }
        }
        setCurrentTree(cloneTree)
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    function handleEscapeNodeNameForm(e) {
        if (e.key === "Escape") {
            setShowNodeNameForm(false)
        }
    }
    function handleDragStart(e) {
        // e.preventDefault()
        e.dataTransfer.setData("currentNode", node.nodeID);
    }
    function preventDragDefault(e) {
        e.preventDefault()
    }
    function handleDrop(e) {
        e.preventDefault()
        let nodeToMoveID = e.dataTransfer.getData("currentNode")
        let currentNodeID = node.nodeID
        if (nodeToMoveID !== currentNodeID && currentNodeID !== currentTree.nodeID) {
            // let newTree = moveNodeBeforeSibling(currentTree, nodeToMoveID, currentNodeID)
            // setCurrentTree(newTree)
            handleMoveNode(nodeToMoveID, currentNodeID, currentTree, setCurrentTree)
        }

    }
    return (
        <>
            <Dropdown menu={{ items }} trigger={'contextMenu'}>
                <div draggable={!node.showDescription}
                    onDragStart={handleDragStart}
                    onDragOver={preventDragDefault}
                    onDragEnter={preventDragDefault}
                    onDragLeave={preventDragDefault}
                    onDrag={preventDragDefault}
                    onDragEnd={preventDragDefault}
                    onDrop={handleDrop}>
                    <Card
                        size={"small"}
                        style={{
                            cursor: "pointer",
                            borderColor: node.nodeColor == "Default" ? antdTheme.token.colorTextSecondary : antdTheme.token[`color${node.nodeColor}BorderHover`],
                            width: node.showDescription ? 400 : cardWidth,
                            maxHeight: 400,
                            height: "auto",
                            // height: node.showDescription ? 400 : 48,
                            backgroundColor: node.nodeColor == "Default" ? antdTheme.token.colorFillQuaternary : antdTheme.token[`color${node.nodeColor}BgHover`],
                            // color: node.nodeColor == "Default" ? antdTheme.token.colorText : antdTheme.token[`color${node.nodeColor}TextActive`],
                            // transition: "width 0.3s, height 0.3s",
                            color: antdTheme.token.colorText
                        }}
                        styles={{
                            body: {
                                maxHeight: 400 - antdTheme.token.paddingSM,
                                display: 'flex', flexDirection: 'column'
                            }
                        }}

                    >
                        {/* <Typography.Text editable={{
                    icon: <></>,
                    onChange: (txt) => { handleRenameNode(txt) },
                    triggerType: "text",
                    enterIcon: <></>
                }}
                    style={{ margin: "auto", marginLeft: 12, width: "100%" }}

                >{node.nodeName}</Typography.Text> */}
                        {
                            showNodeNameForm ? <Form
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                initialValues={{ [`nodeName ${node.nodeID}`]: node.nodeName, remember: true }}
                                onFinish={handleRenameNode}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off">
                                <Space.Compact style={{ width: '100%' }}>
                                    <Form.Item
                                        name={`nodeName ${node.nodeID}`}
                                        style={{ marginBottom: 0, width: "100%" }}
                                    >
                                        <Input autoFocus onKeyDown={handleEscapeNodeNameForm} />
                                    </Form.Item>
                                    {node.showDescription ? <Form.Item style={{ marginBottom: 0 }}>
                                        <Button onClick={() => { setShowNodeNameForm(false) }} icon={<CloseOutlined />} />
                                    </Form.Item> : <></>}

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button htmlType='submit' type='primary' icon={<CheckOutlined />} />
                                    </Form.Item>

                                </Space.Compact>
                            </Form>
                                :
                                <Typography.Text style={{ color: "inherit" }}
                                    // onClick={(e) => {
                                    //     if (e.shiftKey) {
                                    //         setShowNodeNameForm(true)
                                    //     }
                                    // }}

                                    onDoubleClick={() => { setShowNodeNameForm(true) }}
                                >{node.nodeName}</Typography.Text>
                        }
                        {
                            node.showDescription ?
                                <>
                                    <Divider size='large' style={{ margin: `${antdTheme.token.paddingSM}px 0` }} />
                                    {showDescriptionForm ?
                                        <Form
                                            name="basic"
                                            wrapperCol={{ span: 24 }}
                                            initialValues={{ [`nodeDescription ${node.nodeID}`]: node.nodeDescription, remember: true }}
                                            onFinish={handleRewriteDescription}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                        >
                                            <Form.Item
                                                name={`nodeDescription ${node.nodeID}`}
                                                style={{ marginBottom: antdTheme.token.paddingSM }}
                                            >
                                                <Input.TextArea autoFocus autoSize={{
                                                    maxRows: 12
                                                }} />
                                            </Form.Item>
                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <Flex justify='flex-end' gap={antdTheme.token.paddingSM}>
                                                    <Button onClick={() => { setShowDescriptionForm(false) }}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="primary" htmlType="submit">
                                                        Save
                                                    </Button>

                                                </Flex>
                                            </Form.Item>
                                        </Form>
                                        : <div id='outerMarkdown'
                                            // onClick={(e) => {
                                            //     if (e.shiftKey) {
                                            //         setShowDescriptionForm(!showDescriptionForm)
                                            //     }
                                            // }}
                                            onDoubleClick={() => { setShowDescriptionForm(true) }}
                                            style={{ overflowY: "auto", flex: 1, minHeight: 22 }}>
                                            <style>
                                                {`
                                        #outerMarkdown p {
                                            margin: 0px;
                                        }
                                    `}
                                            </style>
                                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} style={{ margin: 0 }}>
                                                {node.nodeDescription}
                                            </Markdown>
                                        </div>}
                                </>
                                : <></>
                        }
                    </Card>
                </div>
            </Dropdown>

            <Modal centered
                title="Do you want to delete this node?"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleDeleteNode}
                onCancel={() => { setIsModalOpen(false) }}
            >
                <Typography.Text>All of its children will also be deleted</Typography.Text>
            </Modal>
        </>
    )
}

const FolderNode = ({ node, nodeType }) => {
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    // let erasedAmount = 50 - 12



    return (
        <>

            <>
                <Flex vertical={true} style={{ marginTop: nodeType == "bot" ? 0 : marginValue }}>
                    <Flex>
                        <LeftLine node={node} nodeType={nodeType} />
                        <NodeCard node={node} />
                    </Flex>
                    {
                        node?.children?.length > 0 && node?.showChildren ?
                            <>
                                <Flex>
                                    <div style={{ caretColor: "transparent", minWidth: cardWidth, minHeight: "100%" }}></div>
                                    <div style={{ caretColor: "transparent", borderLeft: `1px solid ${lineColor}`, minHeight: "100%" }}></div>
                                    <Flex vertical={true}>
                                        {node.children.map((child, index) => {
                                            if (index < node.children.length - 1) {
                                                return (
                                                    <FolderNode key={child.nodeID} node={child} nodeType={"mid"} />
                                                )
                                            }
                                            // else {
                                            //     return <></>
                                            // }
                                        }
                                        )}
                                    </Flex>
                                </Flex>
                                <Flex vertical>
                                    <Flex>
                                        <div style={{ caretColor: "transparent", minWidth: cardWidth, minHeight: marginValue }}></div>
                                        <div style={{ caretColor: "transparent", borderLeft: `1px solid ${lineColor}`, minHeight: marginValue }}></div>

                                    </Flex>
                                    <Flex>
                                        <div style={{ caretColor: "transparent", minWidth: cardWidth, borderRadius: radiusAmount }} />

                                        <FolderNode node={node.children[node.children.length - 1]} nodeType={"bot"} />
                                    </Flex>
                                </Flex>
                            </>
                            : <>
                            </>
                    }
                </Flex>
            </ >
        </>
    )
}

const SpiderNode = ({ node, nodeType }) => {
    let antdTheme = theme.useToken()
    const { currentTree, setCurrentTree } = useContext(CurrentTreeContext);
    let lineColor = antdTheme.token.colorTextTertiary
    return (
        <>
            <Flex>
                <Flex align='center' className='flexTest'>
                    <LeftLine node={node} nodeType={nodeType} />
                    <div style={{ marginTop: marginValue / 2, marginBottom: marginValue / 2 }}>
                        <NodeCard node={node} />
                    </div>
                </Flex>
                {node.children.length > 0 && node.showChildren ?
                    <Flex className='RightLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                        <div style={{
                            caretColor: "transparent", flex: 1, minWidth: cardWidth / 2
                        }}>

                        </div>
                        <div style={{ flex: 1, minWidth: cardWidth / 2, borderTop: `1px solid ${lineColor}` }}>
                        </div>
                    </Flex>
                    : <></>}
                {
                    node.children.length > 0 && node.showChildren ?
                        <>
                            <Flex vertical justify='center'>
                                {/* top child */}
                                {node.children.length > 1 ?
                                    <SpiderNode node={node.children[0]} nodeType={"top"} />
                                    : <></>}
                                {/* mid child */}
                                <Flex>
                                    {node.children.length > 1 ? <div style={{ minHeight: "100%", borderLeft: `1px solid ${lineColor}` }} /> : <></>}
                                    <Flex vertical>
                                        {
                                            node.children.map((child, index) => {
                                                if ((index != 0 && index != node.children.length - 1) || node.children.length == 1) {
                                                    return (
                                                        <SpiderNode key={child.nodeID} node={child} nodeType={"mid"} />
                                                    )
                                                }
                                                // else {
                                                //     return <></>
                                                // }
                                            }
                                            )
                                        }
                                    </Flex>
                                </Flex>
                                {/* bot child */}
                                {node.children.length >= 2 ?
                                    <SpiderNode node={node.children[node.children.length - 1]} nodeType={"bot"} /> : <></>}
                            </Flex>
                        </> :
                        <></>
                }
            </Flex >
        </>
    )
}

const ZoomPanWrapper = ({ children }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();

            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate the point in the content space before zoom
            const beforeZoomX = (mouseX - pan.x) / zoom;
            const beforeZoomY = (mouseY - pan.y) / zoom;

            // Update zoom
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(Math.max(zoom * delta, 0.1), 10);

            // Calculate new pan to keep the mouse point fixed
            const newPanX = mouseX - beforeZoomX * newZoom;
            const newPanY = mouseY - beforeZoomY * newZoom;

            setZoom(newZoom);
            setPan({ x: newPanX, y: newPanY });
        }
    }, [zoom, pan]);

    const handleMouseDown = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - pan.x,
                y: e.clientY - pan.y
            });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && e.ctrlKey) {
            e.preventDefault();
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback((e) => {
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === '0') {
            e.preventDefault();
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                container.removeEventListener('wheel', handleWheel);
            };
        }
    }, [handleWheel]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMouseMove, handleMouseUp, handleKeyDown]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden bg-gray-100 cursor-grab"
            style={{
                cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default'),
                width: "100%", height: "100%"
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Content container */}
            <div
                className="origin-top-left"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
            </div>
        </div>
    );
};
function App() {
    const [currentTree, setCurrentTree] = useState(null);
    const [expandAll, setExpandAll] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [treeLayout, setTreeLayout] = useState("spider")

    let [modeTheme, setModeTheme] = useState("light")
    console.log(currentTree)
    function recursiveAll(currNode, currAtt, contentToModify) {
        currNode[currAtt] = contentToModify != null ? contentToModify : !currNode[currAtt]
        for (let child of currNode.children) {
            recursiveAll(child, currAtt, contentToModify != null ? contentToModify : null)
        }
    }
    function handleExpandAll() {
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveAll(rootNode, "showChildren", !expandAll)
            if (result == true) {
                break
            }
        }
        setExpandAll(!expandAll)
        setCurrentTree(cloneTree)
    }
    function handleShowAll() {
        let cloneTree = JSON.parse(JSON.stringify(currentTree))
        for (let rootNode of cloneTree) {
            let result = recursiveAll(rootNode, "showDescription", !showAll)
            if (result == true) {
                break
            }
        }
        setShowAll(!showAll)
        setCurrentTree(cloneTree)
    }
    function createNewTree() {
        let newRoot = newNodeTemplate()
        setCurrentTree([newRoot])
    }
    const downloadJson = () => {
        const jsonString = JSON.stringify(currentTree, null, 4); // formatted JSON
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "tree.json"; // filename
        link.click();

        URL.revokeObjectURL(url); // cleanup
    };
    useEffect(() => {
        let modeThemeStorage = localStorage.getItem("modeTheme")
        if (modeThemeStorage == "dark") {
            localStorage.setItem("modeTheme", "dark")
            setModeTheme("dark")
        }
        else {
            localStorage.setItem("modeTheme", "light")
            setModeTheme("light")
        }
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    const uploadProps = {
        accept: ".json", // Only allow JSON files
        showUploadList: false, // Hide default file list
        beforeUpload: (file) => {
            // Validate file type
            const isJson = file.type === "application/json" || file.name.endsWith(".json");
            if (!isJson) {
                return Upload.LIST_IGNORE;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    setCurrentTree(json)
                } catch (err) {

                }
            };
            reader.readAsText(file);

            // Prevent automatic upload
            return false;
        },
    };
    return (
        <>
            <ConfigProvider theme={{
                algorithm: modeTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}>
                <CurrentTreeContext.Provider value={{ currentTree, setCurrentTree }}>
                    <Layout
                        style={{
                            height: "100%",
                            padding: 0,
                            scrollbarColor: "red",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <div className='layoutMenu' style={{ padding: 12 }}>
                            <Flex align='center' justify='space-between'>

                                <Flex gap={12} align='center'>
                                    <img width={"15%"} src={`${window.location.href}/logo_${modeTheme}.png`} />
                                    {currentTree
                                        ? <>
                                            <Button onClick={handleExpandAll} type="default" shape="default" icon={expandAll ? <DownOutlined /> : <RightOutlined />}>
                                                {expandAll ? "Collapse all" : "Expand all"}
                                            </Button>
                                            <Button onClick={handleShowAll} type="default" shape="default" icon={showAll ? <EyeOutlined /> : <EyeInvisibleOutlined />}>
                                                {showAll ? "Hide all" : "Show all"}
                                            </Button>
                                        </>
                                        : <>
                                            <Button onClick={createNewTree} type="primary" shape="default" icon={<PlusOutlined />}>
                                                New map
                                            </Button>
                                        </>
                                    }
                                </Flex>
                                <Flex gap={'small'} align='center'>
                                    <Segmented
                                        block={false}
                                        size={"large"}
                                        // shape="round"
                                        onChange={(value) => setTreeLayout(value)}
                                        options={[
                                            { value: 'spider', label: 'Spider layout', icon: <BugOutlined /> },
                                            { value: 'folder', label: 'Folder layout', icon: <FolderOpenOutlined /> },
                                        ]}
                                    />
                                    {currentTree ?
                                        <Button onClick={downloadJson} type="primary" shape="default" icon={<DownloadOutlined />}>
                                            Download
                                        </Button>
                                        :
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>}
                                    <Switch checked={modeTheme == "light"}
                                        unCheckedChildren={<MoonFilled />}
                                        checkedChildren={<SunFilled />}
                                        onClick={(checked, event) => {
                                            if (checked) {
                                                localStorage.setItem("modeTheme", "light")
                                                setModeTheme("light")
                                            }
                                            else {
                                                localStorage.setItem("modeTheme", "dark")
                                                setModeTheme("dark")
                                            }
                                        }} />
                                </Flex>
                            </Flex>
                        </div>
                        <Divider style={{ margin: `0 12px` }} />
                        <div className='insideWrapper' style={{ flex: 1, width: "100%", overflow: "hidden" }}>
                            <ZoomPanWrapper>
                                {currentTree?.length > 0 ? <>
                                    {
                                        treeLayout == "spider" ? currentTree.map((child, index) => <SpiderNode key={child.nodeID} node={child} nodeType={"root"} />) : <></>
                                    }
                                    {
                                        treeLayout == "folder" ? currentTree.map((child, index) => <FolderNode key={child.nodeID} node={child} nodeType={"root"} />) : <></>
                                    }
                                </> : <></>}

                            </ZoomPanWrapper>
                        </div>
                    </Layout>
                </CurrentTreeContext.Provider>
            </ConfigProvider>
        </>
    );
}

export default App;
