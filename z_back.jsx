
                            <Flex vertical justify='center'>
                                {/* top child */}
                                {node.children.length > 1 ?
                                    <SpiderNode node={node.children[0]} nodeType={"top"} />
                                    : <></>}
                                {/* mid child */}
                                {node.children.length >= 1 ?
                                    <Flex>
                                        <div style={{ minHeight: "100%", borderRight: `1px solid ${lineColor}` }} />
                                        <Flex vertical>
                                            {
                                                node.children.map((child, index) => {
                                                    if (index != 0 && index != node.children.length - 1) {
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
                                    : <></>}
                                {/* bot child */}
                                {node.children.length >= 2 ?
                                    <SpiderNode node={node.children[node.children.length - 1]} nodeType={"bot"} /> : <></>}
                            </Flex>