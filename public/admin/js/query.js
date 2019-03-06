    function getQueryVariable(query) {
        var vars = query.split("&&");
        var ans = {}
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            ans[pair[0]] = pair[1]
        }
        return ans
    }
    